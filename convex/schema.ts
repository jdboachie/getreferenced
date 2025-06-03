import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema({
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),

    indexNumber: v.optional(v.string()),
    studentNumber: v.optional(v.string()),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    transcriptFile: v.optional(v.string()), // Expecting file storage ID
    cvFile: v.optional(v.string()),         // Expecting file storage ID
    yearOfCompletion: v.optional(v.number()),
    programOfStudy: v.optional(v.string()),
    certificateFile: v.optional(v.string()) // Optional file
  }).index("email", ["email"]),
  numbers: defineTable({
    value: v.number(),
  }),
});
