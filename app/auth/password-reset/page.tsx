'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function PasswordReset() {

  const router = useRouter()
  const { signIn } = useAuthActions();

  const [step, setStep] = useState<"forgot" | { email: string }>("forgot");
  const [error, setError] = useState<string | null>(null)

  return(
    <div className="w-full p-4 grid gap-8">
      <h1 className="text-xl font-medium">Reset Password</h1>
      {error && (
        <div className="mb-6 p-3 rounded-lg border-destructive bg-destructive/5 text-sm text-destructive">
          {error}
        </div>
      )}
      {step === "forgot" ? (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            void signIn("password", formData)
              .then(() =>
                setStep({ email: formData.get("email") as string })
              )
              .catch(() => {setError(`${formData.get("email")} is not registered on GetReferenced`)})
          }}
          className="w-full grid gap-8"
          >
          <label className="grid gap-1">
            <span className="text-sm font-medium">Email</span>
            <Input name="email" placeholder="Email" type="text" />
            <span className="text-sm text-muted-foreground">We will send a code to this email address.</span>
          </label>
          <input name="flow" type="hidden" value="reset" />
          <Button type="submit">Send code</Button>
        </form>
      ) : (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            toast.promise(
              signIn("password", formData).then(() => router.push("/app")),
              {
                loading: "Signing in...",
                success: "Signed in successfully!",
                error: "Failed to sign in.",
              }
            );
          }}

          className="w-full grid gap-8"
        >
          <div className="">We have sent a code to — {step.email}.</div>
          <Input name="code" placeholder="Code" type="text" />
          <Input name="newPassword" placeholder="New password" type="password" />
          <input name="email" value={step.email} type="hidden" />
          <input name="flow" value="reset-verification" type="hidden" />
          <div className="grid gap-2 w-full">
            <Button size={'lg'} type="submit" className="grow">Continue</Button>
            <Button size={'lg'} variant={'outline'} type="button" onClick={() => setStep("forgot")}>
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}