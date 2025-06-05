import { Password } from "@convex-dev/auth/providers/Password";
import { DataModel } from "./_generated/dataModel";
import { ResendOTP } from "./ResendOTP";

export default Password<DataModel>({
  profile(params) {
    return {
      email: params.email as string,
      role: params.role as "recommender" | "requester" | undefined,
    };
  },
  verify: ResendOTP
});