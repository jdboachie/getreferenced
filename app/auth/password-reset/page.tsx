'use client';

import { useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertTriangleIcon } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";

export default function PasswordReset() {

  const router = useRouter()
  const { signIn } = useAuthActions();

  const [code, setCode] = useState("")
  const [step, setStep] = useState<"forgot" | { email: string }>("forgot");
  const [error, setError] = useState<string | null>(null)

  return(
    <>
      <h2>Reset Password</h2>
      {error && (
        <Alert variant="destructive" className="border-destructive bg-destructive/5 mb-4">
          <AlertTriangleIcon />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
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
              .catch(() => {
                setError(`${formData.get("email")} is not registered on GetReferenced`)
                setTimeout(() => {
                  setError(null)
                }, 7000)
              })
          }}
          className="w-full grid gap-8"
          >
          <p className="text-sm text-muted-foreground">
            Enter the email you used to register for GetReferenced.
          </p>
          <label className="grid gap-1">
            <span className="text-sm font-medium">Email</span>
            <Input name="email" placeholder="Email" type="text" />
            <span className="text-sm text-muted-foreground">We will send a code to this email address. Be sure to check your spam folder.</span>
          </label>
          <input name="flow" type="hidden" value="reset" />
          <div className="grid gap-2 w-full">
            <Button type="submit">Send code</Button>
            <Link
              href="/auth"
              className={buttonVariants({ size: "lg", variant: "outline" })}
              >
              Back
            </Link>
          </div>
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
          <p className="text-sm text-muted-foreground">
            Enter the code sent to — <span className="font-medium">{step.email}.</span>
          </p>
          <label className="grid gap-1">
            <span className="text-sm font-medium">Verification code</span>
            <InputOTP
              name="code"
              maxLength={8}
              value={code}
              onChange={(value) => setCode(value)}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSeparator />
                <InputOTPSlot className="border-l" index={4} />
                <InputOTPSlot index={5} />
                <InputOTPSlot index={6} />
                <InputOTPSlot index={7} />
              </InputOTPGroup>
            </InputOTP>
          </label>
          <label className="grid gap-1">
            <span className="text-sm font-medium">Enter a new password</span>
            <Input name="newPassword" placeholder="New password" type="password" />
          </label>
          <input name="email" value={step.email} type="hidden" />
          <input name="flow" value="reset-verification" type="hidden" />
          <div className="grid gap-2 w-full">
            <Button size={'lg'} type="submit">Reset password</Button>
            <Button size={'lg'} variant={'outline'} type="button" onClick={() => setStep("forgot")}>
              Back
            </Button>
          </div>
        </form>
      )}
    </>
  )
}