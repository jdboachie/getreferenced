import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const schema = defineSchema({
  ...authTables,

  users: defineTable({
    image: v.optional(v.union(v.id("_storage"), v.string())),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    name: v.optional(v.string()),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    role: v.optional(v.union(v.literal("requester"), v.literal("recommender"))),
  })
    .index("email", ["email"])
    .index("by_role", ["role"]),

  requesters: defineTable({
    userId: v.id("users"),
    indexNumber: v.optional(v.string()),
    studentNumber: v.optional(v.string()),
    transcriptFile: v.optional(v.id("_storage")),
    cvFile: v.optional(v.id("_storage")),
    yearOfCompletion: v.optional(v.string()),
    programOfStudy: v.optional(v.string()),
    certificateFile: v.optional(v.id("_storage")),
  })
    .index("by_userId", ["userId"]),

  recommenders: defineTable({
    userId: v.id("users"),
    staffNumber: v.optional(v.string()),
    primaryEmail: v.optional(v.string()),
    secondaryEmail: v.optional(v.string()),
    department: v.optional(v.string()),
    yearOfEmployment: v.optional(v.string()),
    phoneNumber: v.optional(v.string()),
    currentRank: v.optional(v.string()),
  })
    .index("by_userId", ["userId"]),

  requests: defineTable({
    additionalInfo: v.optional(v.string()),
    deadline: v.float64(),
    institutionAddress: v.string(),
    institutionName: v.string(),
    purpose: v.union(
        v.literal("admission"),
        v.literal("scholarship"),
        v.literal("employment"),
        v.literal("other")
    ),
    status: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("rejected"),
        v.literal("accepted"),
        v.literal("drafted"),
      )
    ),
    recommenderId: v.id("users"),
    sampleLetter: v.optional(v.id("_storage")),
    userId: v.id("users"),
  })
    .index("by_recommenderId", ["recommenderId"])
    .index("by_userId", ["userId"]),
});

export default schema;