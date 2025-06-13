
"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuthActions } from "@convex-dev/auth/react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { api } from "@/convex/_generated/api"
import { useMutation } from "convex/react"
// import { ForwardIcon } from "lucide-react"

const FormSchema = z.object({
  code: z.string().min(8, {
    message: "The code must be 8 characters.",
  }),
})

export default function Page() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email")!
  const role = searchParams.get('role')! as "requester" | "recommender"

  const { signIn } = useAuthActions()

  const createProfile = useMutation(api.users.createProfile)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      code: "",
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const formData = new FormData()
    formData.append("code", data.code)
    formData.append("flow", "email-verification")
    formData.append("email", email)

    await signIn("password", formData)
    setTimeout(async() => {
      await createProfile({ role })
      router.push("/app/account")
    }, 700)
  }

  return (
    <div className="w-full p-4">
      <h1 className="text-2xl font-medium mb-1">Verify Email</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full grid">
          <p className="text-sm text-muted-foreground">
            Enter the code sent to <span className="font-medium">{email}</span>
          </p>
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
                    <Button type="submit" size={'lg'}>
                      {/* <ForwardIcon className="stroke-[2.5]" /> */}
                      Verify email
                    </Button>
                  </div>
                </FormControl>
                <FormDescription>
                  You can find the code in your email inbox.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <input type="hidden" name="flow" value="email-verification" />
          <input type="hidden" name="email" value={email} />
        </form>
      </Form>
    </div>
  )
}
