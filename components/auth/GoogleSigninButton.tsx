import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { useAuthActions } from "@convex-dev/auth/react";


export default function GoogleAuthButton ({redirectTo, signUp} : {redirectTo: string, signUp?: boolean}) {

  const { signIn } = useAuthActions();

  return (
    <Button
      type="button"
      variant={'outline'}
      size={'lg'}
      className="w-full"
      onClick={() => void signIn("google", {redirectTo: redirectTo})}
    >
      <Image
        src={'/google.webp'}
        width={100}
        height={100}
        alt={'Google logo'}
        className="size-4"
      />
      Sign {signUp ? 'up' : 'in'} with Google
    </Button>
  )
}