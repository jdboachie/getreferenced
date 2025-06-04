// import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

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
  // args: {
  //   userId: v.id("users"),
  // },
  handler: async (ctx, ) => { //args
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }
    const requesterId = await ctx.db.insert("requesters", {
      userId: userId,
    });

    return requesterId;
  },
});

export const createRecommenderProfile = mutation({
  // args: {
  //   userId: v.id("users"),
  // },
  handler: async (ctx, ) => { //args
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }
    const recommenderId = await ctx.db.insert("recommenders", {
      userId: userId,
    });

    return recommenderId;
  }
})