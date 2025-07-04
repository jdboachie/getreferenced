import {
  Tabs,
  TabsList,
  TabsContent,
  TabsTrigger,
} from "@/components/ui/tabs";
import SignInForm from '@/components/auth/signinForm';
import SignUpForm from '@/components/auth/signupForm';

export default async function Page(
  {searchParams}
  :
  {searchParams: Promise<{action: 'signup' | 'signin' | undefined}>}
) {

  const action = (await searchParams).action

  return (
    <Tabs defaultValue={action ?? "signin"} className="w-full">
      <TabsList className='w-full mb-8'>
        <TabsTrigger value="signin">Sign In</TabsTrigger>
        <TabsTrigger value="signup">Sign Up</TabsTrigger>
      </TabsList>
      <TabsContent value="signin"><SignInForm /></TabsContent>
      <TabsContent value="signup"><SignUpForm /></TabsContent>
    </Tabs>
  )
}
