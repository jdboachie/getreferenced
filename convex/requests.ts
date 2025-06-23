import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Fetch all requests by the authenticated user
export const getRequestsByUser = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("requests")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();
  },
});

// Fetch all requests assigned to the authenticated recommender
export const getRequestsByRecommender = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const recommender = await ctx.db.get(userId);
    // might want to confirm that the person has the right role ( recommender )

    if (!recommender) return [];

    return await ctx.db
      .query("requests")
      .withIndex("by_recommenderId", (q) => q.eq("recommenderId", recommender._id))
      .collect();
  },
});


// Fetch a single request by ID
export const getRequestById = query({
  args: { id: v.id("requests") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

// Create a new request
export const createRequest = mutation({
  args: {
    recommenderId: v.id("users"),
    institutionName: v.string(),
    institutionAddress: v.string(),
    deadline: v.float64(),
    purpose: v.union(
        v.literal("admission"),
        v.literal("scholarship"),
        v.literal("employment"),
        v.literal("other")
    ),
    additionalInfo: v.optional(v.string()),
    sampleLetter: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    return await ctx.db.insert("requests", {
      ...args,
      userId,
      status: "pending",
    });
  },
});

// Update an existing request
export const updateRequest = mutation({
  args: {
    id: v.id("requests"),
    institutionName: v.optional(v.string()),
    institutionAddress: v.optional(v.string()),
    deadline: v.optional(v.float64()),
    purpose: v.optional(
      v.union(
        v.literal("admission"),
        v.literal("scholarship"),
        v.literal("employment"),
        v.literal("other")
      )
    ),
    additionalInfo: v.optional(v.string()),
    sampleLetter: v.optional(v.id("_storage")),
    status: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("rejected"),
        v.literal("accepted"),
        v.literal("drafted")
      )
    ),
    recommenderId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const existing = await ctx.db.get(args.id);
    if (!existing || existing.userId !== userId) throw new Error("Forbidden");

    const { id, ...data } = args;
    await ctx.db.patch(id, data);
  },
});

// Delete a request
export const deleteRequest = mutation({
  args: { id: v.id("requests") },
  handler: async (ctx, { id }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const existing = await ctx.db.get(id);
    if (!existing || existing.userId !== userId) throw new Error("Forbidden");

    await ctx.db.delete(id);
  },
});
