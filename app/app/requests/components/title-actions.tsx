'use client';

import Link from 'next/link';
import { useRole } from '@/hooks/use-role';
import { Button, buttonVariants } from '@/components/ui/button';
import { Skeleton } from "@/components/ui/skeleton";
import { usePathname } from 'next/navigation';
import { UserSwitchIcon, PlusIcon } from "@phosphor-icons/react";


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
  return (
    <div className='flex items-center gap-2 size-fit'>
      {(role === 'requester' && match) &&
        <Button size={'lg'} variant={'outline'}>
          <UserSwitchIcon size={32} className="size-5" />
          Re-assign
        </Button>
      }
      {pathname !== '/app/requests/new' && role === "requester" && (
        <Link
          className={`${buttonVariants({ size: "lg", variant: "default" })}`}
          prefetch
          href="/app/requests/new"
        >
          <PlusIcon className="size-5" />
          <span className="">New request</span>
        </Link>
      )}
    </div>
  )
}

export default TitleActions