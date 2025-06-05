import { v } from "convex/values";
import { api } from "./_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";
import { query, mutation } from "./_generated/server";

export const getUserProfile = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const user = await ctx.db.get(userId);
    if (!user?.role) return null;

    const table = user.role === "requester" ? "requesters" : "recommenders";
    const profile = await ctx.db
      .query(table)
      .withIndex("userId", (q) => q.eq("userId", userId))
      .unique();

    return profile ? { ...profile, user } : null;
  },
});

export const createRequesterProfile = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    if (args.userId === null) {
      console.error("User ID is null, cannot create requester profile.");
      return null;
    }
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
  handler: async (ctx, ) => { //args
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }
    await ctx.db.insert("recommenders", {
      userId: userId,
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
      await ctx.runMutation(api.users.createRequesterProfile, {
        userId: userId
      });
    } else if (args.role === "recommender") {
      await ctx.runMutation(api.users.createRecommenderProfile, {
        userId: userId
      });
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