import { buttonVariants, Button } from "@/components/ui/button";
import Link from 'next/link';
import { ArrowSquareOutIcon, UserListIcon } from '@phosphor-icons/react';
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";

export function ProfileEmptyState ({role}:{role: 'recommender' | 'requester'}) {

  const createProfile = useMutation(api.users.createProfile)

  return (
    <div className="flex flex-col gap-2 p-5 items-center justify-center h-full">
      <div className='border size-16 mb-4 rounded-full grid place-items-center'><UserListIcon className='size-6' /></div>
      <p className="text-sm font-medium">Profile Not Found</p>
      <p className="text-sm text-muted-foreground">
        Please contact support if you believe this is an error.
      </p>
      <div className='grid gap-2 mt-2'>
        <Button disabled variant={'outline'} onClick={async () => await createProfile({ role : role })}>
          Create Profile
        </Button>
        <Link
          href={'/auth/onboarding'}
          className={`${buttonVariants({ size: 'default', variant: 'outline' })}`}
        >
          Go to onboarding
        </Link>
        <Link
          href={'#'}
          className={`${buttonVariants({ variant: 'link', size: 'sm' })} text-xs !text-muted-foreground hover:text-primary`}
        >
          Contact support <ArrowSquareOutIcon weight='bold' />
        </Link>
      </div>
    </div>
  )
}