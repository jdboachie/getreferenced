import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const uploadUserImage = mutation({
  args: {
    storageId: v.optional(v.union(v.id("_storage"), v.string())),
    userId: v.id("users"),
    prevStorageId: v.optional(v.union(v.id("_storage"), v.string())),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      image: args.storageId,
    });
    if (args.prevStorageId) {
      await ctx.storage.delete(args.prevStorageId);
    }
  },
});

export const getFileUrl = query({
  args: { src: v.optional(v.union(v.id("_storage"), v.string())), },
  handler: async (ctx, args) => {
    if (!args.src) {
      return null;
    }
    if (typeof args.src === 'string') return args.src;
    return await ctx.storage.getUrl(args.src);
  },
})

export const getMetadata = query({
  args: {
    storageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    if (args.storageId)
    return await ctx.db.system.get(args.storageId);
  },
});

export const listAllFiles = query({
  handler: async (ctx) => {
    // You can use .paginate() as well
    return await ctx.db.system.query("_storage").collect();
  },
});