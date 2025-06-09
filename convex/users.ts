import { v } from "convex/values";
import { api } from "./_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";
import { query, mutation } from "./_generated/server";

// export const getUserProfile = query({
//   handler: async (ctx) => {
//     const userId = await getAuthUserId(ctx);
//     if (!userId) return null;

//     const user = await ctx.db.get(userId);
//     if (!user?.role) return null;

//     if (user.role === "requester") {
//       const requester = await ctx.db
//         .query("requesters")
//         .withIndex("userId", (q) => q.eq("userId", userId))
//         .unique();

//       return requester
//     } else if (user.role === "recommender") {
//       const recommender = await ctx.db
//         .query("recommenders")
//         .withIndex("userId", (q) => q.eq("userId", userId))
//         .unique();

//       return recommender
//     }

//     return null;

//   },
// });

export const getRequesterProfile = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const user = await ctx.db.get(userId);
    if (user?.role !== "requester") return null;

    const requester = await ctx.db
      .query("requesters")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .unique();

    return requester;
  },
});

export const getRecommenderProfile = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const user = await ctx.db.get(userId);
    if (user?.role !== "recommender") return null;

    const recommender = await ctx.db
      .query("recommenders")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .unique();

    return recommender;
  },
});

export const updateUserProfile = mutation({
  args: {
    role: v.union(v.literal("requester"), v.literal("recommender")),
    userId: v.id("users"),
    cvFile: v.optional(v.id("_storage")),
    transcriptFile: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query(args.role === "requester" ? "requesters" : "recommenders")
      .withIndex("userId", (q) => q.eq("userId", args.userId))
      .unique();

    if (!profile) throw new Error("Profile not found");

    await ctx.db.patch(profile._id, {cvFile: args.cvFile});
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