import { v } from "convex/values";
import { api } from "./_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";
import { query, mutation } from "./_generated/server";

export const getCurrentUser = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }
    return await ctx.db.get(userId);
  },
});

export const getRequesterProfile = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const user = await ctx.db.get(userId);
    if (user?.role !== "requester") return null;

    const requester = await ctx.db
      .query("requesters")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    return requester;
  },
});

export const getAllRecommenders = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const recommenders = await ctx.db.query("users")
      .withIndex("by_role", (q) =>  q.eq("role", "recommender"))
      .collect()

    return recommenders;
  },
})

export const getRecommenderProfile = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const user = await ctx.db.get(userId);
    if (user?.role !== "recommender") return null;

    const recommender = await ctx.db
      .query("recommenders")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    return recommender;
  },
});

export const updateUserProfile = mutation({
  args: {
    role: v.union(v.literal("requester"), v.literal("recommender")),
    userId: v.id("users"),
    cvFile: v.optional(v.id("_storage")),
    transcriptFile: v.optional(v.id("_storage")),
    certificateFile: v.optional(v.id("_storage")),
    indexNumber: v.optional(v.string()),
    studentNumber: v.optional(v.string()),
    programOfStudy: v.optional(v.string()),
    yearOfCompletion: v.optional(v.string()),
    staffNumber: v.optional(v.string()),
    secondaryEmail: v.optional(v.string()),
    department: v.optional(v.string()),
    yearOfEmployment: v.optional(v.string()),
    currentRank: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query(args.role === "requester" ? "requesters" : "recommenders")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    if (!profile) throw new Error("Profile not found");

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { role, ...rest } = args;
    const filteredArgs = Object.fromEntries(
      Object.entries(rest).filter(([value]) => value !== undefined)
    );

    await ctx.db.patch(profile._id, filteredArgs);
  },
});

export const createRequesterProfile = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("requesters", {
      userId: args.userId,
    });

    // return requesterId;
  },
});

export const createRecommenderProfile = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => { //args
    await ctx.db.insert("recommenders", {
      userId: args.userId,
    });

    // return recommenderId;
  }
})

export const createProfile = mutation({
  args: { role: v.union(v.literal("requester"), v.literal("recommender")) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User is not authenticated");
    }

    if (args.role === "requester") {
      await ctx.runMutation(api.users.createRequesterProfile, {userId});
    } else if (args.role === "recommender") {
      await ctx.runMutation(api.users.createRecommenderProfile, {userId});
    } else {
      throw new Error("Invalid role specified");
    }
  },
});

export const updateUser = mutation({
  args: {
    userId: v.id("users"),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    phone: v.optional(v.string()),
    image: v.optional(v.string()),
    role: v.optional(v.union(v.literal("requester"), v.literal("recommender"))),
    profileCreatedTime: v.optional(v.number()),
  },
  handler: async (ctx, args) => {

    //drop the userId from args
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { userId, ...rest } = args;

    // filter for args that are not undefined
    const filteredArgs = Object.fromEntries(
      Object.entries(rest).filter(([value]) => value !== undefined)
    );

    await ctx.db.patch(args.userId, {
      ...filteredArgs,
    });
  },
});