import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createRequester = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const requesterId = await ctx.db.insert("requesters", {
      userId: args.userId,
    });

    return requesterId;
  },
});

export const createRecommender = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const recommenderId = await ctx.db.insert("recommenders", {
      userId: args.userId,
    });

    return recommenderId;
  }
})