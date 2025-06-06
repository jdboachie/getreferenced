"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter, useSearchParams } from 'next/navigation';

export default function Page() {

  console.log("render")
  // TODO: Handle malformed urls (remove not null assertion!)

  const router = useRouter()
  const searchParams = useSearchParams();
  const role = searchParams.get('role')! as "requester" | "recommender"
  const email = searchParams.get('email')!;

  const createProfile = useMutation(api.users.createProfile)

  const { signIn } = useAuthActions();

  return (
    <form
      className="space-y-8 w-full grid"
      onSubmit={async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        await signIn("password", formData)
        setTimeout(async () => {
          await createProfile({ role })
          router.push('/app/settings')
        }, 700);
      }}
    >
      <p>Enter the code sent to {email}</p>
      <Input autoFocus name="code" placeholder="Code" type="text" />
      <Input name="flow" type="hidden" value="email-verification" />
      <Input name="email" value={email} type="hidden" />
      <Button type="submit">Continue</Button>
    </form>
  )
}
