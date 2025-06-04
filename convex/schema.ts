import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const schema = defineSchema({
  ...authTables,

  users: defineTable({
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    role: v.optional(v.union(v.literal("requester"), v.literal("recommender"))),
  }).index("email", ["email"]),

  requesters: defineTable({
    userId: v.id("users"),
    indexNumber: v.optional(v.string()),
    studentNumber: v.optional(v.string()),
    transcriptFile: v.optional(v.string()),
    cvFile: v.optional(v.string()),
    yearOfCompletion: v.optional(v.string()),
    programOfStudy: v.optional(v.string()),
    certificateFile: v.optional(v.string()),
  }).index("userId", ["userId"]),

  recommenders: defineTable({
    userId: v.id("users"),
    staffNumber: v.optional(v.string()),
    primaryEmail: v.optional(v.string()),
    secondaryEmail: v.optional(v.string()),
    department: v.optional(v.string()),
    yearOfEmployment: v.optional(v.string()),
    phoneNumber: v.optional(v.string()),
    currentRank: v.optional(v.string()),
  }).index("userId", ["userId"]),
});

export default schema;