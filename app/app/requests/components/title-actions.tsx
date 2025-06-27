'use client';

import Link from 'next/link';
import { useRole } from '@/hooks/use-role';
import { Button, buttonVariants } from '@/components/ui/button';
import { Skeleton } from "@/components/ui/skeleton";
import { usePathname } from 'next/navigation';
import { UserSwitchIcon, NotePencilIcon, CheckIcon, XIcon } from "@phosphor-icons/react";


const TitleActions = () => {

  const { role } = useRole();
  const pathname = usePathname();

  const match = pathname.match(/^\/app\/requests\/([^\/]+)(\/.*)?$/);

  if (pathname === "/app/requests/new") return null
  if (role === null) return (
    <div className='flex gap-2 items-center'>
      <Skeleton className="w-36 sm:w-44 h-10" />
      <Skeleton className="w-36 sm:w-44 h-10" />
    </div>
  )
  if (role === 'requester') {
    return (
      <div className='flex items-center gap-2 size-fit'>
        {pathname !== '/app/requests/new' && (
          <Link
            className={`${buttonVariants({ size: "lg", variant: "default" })}`}
            prefetch
            href="/app/requests/new"
          >
            <NotePencilIcon size={32} weight='bold' className="size-5" />
            <span className="">New request</span>
          </Link>
        )}
        {match &&
          <Button size={'lg'} variant={'outline'}>
            <UserSwitchIcon size={32} className="size-5" />
            Re-assign
          </Button>
        }
      </div>

    )
  }
  if (role === 'recommender' && match){
    return (
      <div className='flex items-center gap-2 size-fit'>
        <Button size={'lg'} variant={'outline'}>
          <CheckIcon size={32} weight='bold' className="size-5 text-success" />
          Accept
        </Button>
        <Button size={'lg'} variant={'outline'}>
          <XIcon size={32} weight='bold' className="size-5 text-destructive" />
          Reject
        </Button>
      </div>
    )
  }
  return null
}

export default TitleActions