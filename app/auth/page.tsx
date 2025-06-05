import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SignInForm from '@/components/auth/signinForm'
import SignUpForm from '@/components/auth/signupForm'

export default function Page() {
  return (
    <div className="grid sm:max-w-md max-sm:w-full p-4 sm:rounded-lg border max-sm:border-x-0 md:shadow-xs bg-background w-full h-fit">
      <Tabs defaultValue="signUp" className="w-full">
        <TabsList className='w-full mb-8'>
          <TabsTrigger value="signIn">Sign In</TabsTrigger>
          <TabsTrigger value="signUp">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="signIn"><SignInForm /></TabsContent>
        <TabsContent value="signUp"><SignUpForm /></TabsContent>
      </Tabs>
    </div>
  )
}
