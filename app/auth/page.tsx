"use client";

import * as React from "react";
import { useSearchParams } from 'next/navigation';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SignInForm from '@/components/auth/signinForm'
import SignUpForm from '@/components/auth/signupForm'

export default function Page() {

  const searchParams = useSearchParams();
  const action = searchParams.get('action')!

  return (
    <div className="grid sm:max-w-md max-sm:w-full p-4 w-full h-fit">
      <Tabs defaultValue={action ?? "signin"} className="w-full">
        <TabsList className='w-full mb-8'>
          <TabsTrigger value="signin">Sign In</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="signin"><SignInForm /></TabsContent>
        <TabsContent value="signup"><SignUpForm /></TabsContent>
      </Tabs>
    </div>
  )
}
