'use client';

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


function Page() {
  const user = useQuery(api.auth.getCurrentUser);

  if (user){
  return (
    <div className="flex flex-col gap-8">
      <div className="border bg-muted dark:bg-background rounded-lg">
        <div className="bg-background rounded-t-lg p-4 gap-3 flex flex-col">
          <h3 className="font-medium text-lg">Email</h3>
          <p className="text-sm">This is the email address you will use to sign in to Recommendme.</p>
          <Input
            value={user.email}
            readOnly
            className="w-full shadow-none"
          />
        </div>
        <div className="flex max-md:flex-col md:gap-2 gap-4 items-center justify-between rounded-b-lg border-t p-4">
          <p className="text-sm text-muted-foreground">Email must be verified to be able to login with it or receive notifications.</p>
          <Button>Save</Button>
        </div>
      </div>
      <div className="border bg-background rounded-lg p-4 gap-3 flex flex-col">
        <h3 className="font-medium text-lg">Full name</h3>
        <p className="text-sm">This will be the name on your requests</p>
        <Input
          value={user.name}
          readOnly
          placeholder="Firstname Lastname"
          className="w-full shadow-none"
        />
      </div>
    </div>
  )}
  else {
    return 'loading...'
  }
}

export default Page