// import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getAuthRequesterProfile = query({
  handler: async (ctx,) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }
    const requester = await ctx.db
      .query("requesters")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .unique();
    if (!requester) {
      return null;
    }
    const user = await ctx.db.get(requester.userId);
    return {
      ...requester,
      user,
    };
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