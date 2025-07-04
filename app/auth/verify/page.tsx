"use client";

import { z } from "zod";
import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangleIcon } from "lucide-react";

const FormSchema = z.object({
  code: z.string().min(8, {
    message: "The code must be 8 characters.",
  }),
});

export default function Page() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email")!

  const { signIn } = useAuthActions()
  const [error, setError] = React.useState<string | null>(null)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      code: "",
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setError(null)
    const formData = new FormData()
    formData.append("code", data.code)
    formData.append("flow", "email-verification")
    formData.append("email", email)

    await signIn("password", formData)
      .then(() => {
        router.push("/app/account")
      })
      .catch(() => {
        setError(
          "Verification failed. Please check your code and try again."
        )
      })
  }

  return (
    <>
      <h2>Verify Email</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full grid">
          <p className="text-sm text-muted-foreground">
            Enter the code sent to <span className="font-medium">{email}</span>
          </p>
          {error && (
            <Alert variant="destructive" className="border-destructive bg-destructive/5">
              <AlertTriangleIcon />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          )}
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification Code</FormLabel>
                <FormControl>
                  <div className="grid gap-6">
                    <InputOTP maxLength={8} {...field}>
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
                  </div>
                </FormControl>
                <FormDescription>
                  You can find the code in your email inbox. Be sure to check your spam folder.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" size={'lg'}>
            Verify email
          </Button>
          <input type="hidden" name="flow" value="email-verification" />
          <input type="hidden" name="email" value={email} />
        </form>
      </Form>
    </>
  )
}
