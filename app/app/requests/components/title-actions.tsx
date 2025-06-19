'use client';

import Link from 'next/link';
import { PlusIcon } from 'lucide-react';
import { useRole } from '@/hooks/use-role';
import { Button, buttonVariants } from '@/components/ui/button';
import { Skeleton } from "@/components/ui/skeleton";
import { usePathname } from 'next/navigation';


const TitleActions = () => {

  const { role } = useRole();
  const pathname = usePathname();

  const match = pathname.match(/^\/app\/requests\/([^\/]+)(\/.*)?$/);

  if (role === null) return (
    <div className='flex gap-2 items-center'>
      <Skeleton className="w-44 h-10" />
      <Skeleton className="w-44 h-10" />
    </div>
  )
  return (
    <div className='flex items-center gap-2'>
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
      {pathname !== '/app/requests/new' && match &&
        <Button size={'lg'} variant={'outline'}>
          Re-assign
        </Button>
      }

    </div>
  )
}

export default TitleActions