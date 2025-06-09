import Password from "./CustomProfile";
import { query } from "./_generated/server";
import { convexAuth, getAuthUserId } from "@convex-dev/auth/server";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Password],
  // callbacks: {
  //   // `args` are the same the as for `createOrUpdateUser` but include `userId`
  //   async afterUserCreatedOrUpdated(ctx: MutationCtx, { userId }) {
  //     const role = await ctx.db.get(userId).then(user => user?.role);
  //     if (!role) {
  //       throw new Error("User role is not set");
  //     }

  //     const user = await ctx.db.get(userId);

  //     if (user?.profileCreatedTime) {
  //       console.debug("Updating user:", userId);
  //       return;
  //     }
  //     await ctx.runMutation(internal.users.createProfile, {
  //       userId: userId,
  //       role: role
  //     });
  //     await ctx.runMutation(api.users.updateUser, {
  //       userId: userId,
  //         profileCreatedTime: Date.now(),
  //     })
  //   },
  // },
});

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }
    return await ctx.db.get(userId);
  },
});
