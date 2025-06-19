import { v } from "convex/values";
// import { Id } from './_generated/dataModel';
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
  args: {
    src: v.optional(v.union(v.id("_storage"), v.string())),
  },
  handler: async (ctx, args) => {
    if (!args.src) return null;

    if (typeof args.src !== "string") {
      return await ctx.storage.getUrl(args.src);
    }

    // Try resolving it as a storage ID
    try {
      return await ctx.storage.getUrl(args.src);
    } catch {
      // If not a valid storage ID, assume it's a normal URL
      return args.src;
    }
  },
});

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

export const deleteFile = mutation({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    await ctx.storage.delete(args.storageId)
  },
})