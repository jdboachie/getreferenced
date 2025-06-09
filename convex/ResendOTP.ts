import Resend from "@auth/core/providers/resend";
import { Resend as ResendAPI } from "resend";
import { alphabet, generateRandomString } from "oslo/crypto";

export const ResendOTP = Resend({
  id: "resend-otp",
  apiKey: process.env.AUTH_RESEND_KEY,
  async generateVerificationToken() {
    return generateRandomString(8, alphabet("0-9"));
  },
  async sendVerificationRequest({ identifier: email, provider, token }) {
    const resend = new ResendAPI(provider.apiKey);
    const formattedToken = `${token.slice(0, 4)}-${token.slice(-4)}`;
    const { error } = await resend.emails.send({
      from: "Recommenso <onboarding@resend.dev>",
      to: [email],
      subject: `Sign in to Recommenso`,
      text: "Your code is " + formattedToken,
    });

    if (error) {
      throw new Error("Could not send");
    }
  },
});