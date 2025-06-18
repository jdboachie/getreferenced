'use client'

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useQuery } from 'convex/react';
import { useRole } from '@/hooks/use-role';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { Button, buttonVariants } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';


export default function Page({
  params: asyncParams,
}: {
  params: Promise<{ id: Id<"requests">}>
}) {
  const { id } = React.use(asyncParams);
  const { role } = useRole();
  const data = useQuery(api.requests.getRequestById, { id });

  if (data === undefined) return <p className="text-muted-foreground">Loading...</p>;
  if (data === null) return <p className="text-destructive">Request not found.</p>;

  return (
    <section>
      <div className='flex justify-between gap-2'>
        {role === 'requester' &&
          <div className='flex gap-2'>
            <Button size="lg" variant="outline">Re-assign</Button>
            <Link
              className={`${buttonVariants({ size: "lg", variant: "default" })} max-md:size-10 max-md:px-0`}
              prefetch
              href="/app/requests/new"
            >
              <PlusIcon className="size-5 md:hidden" />
              <span className="max-md:hidden">New request</span>
            </Link>
          </div>
        }
      </div>
      <div className="w-full flex flex-col gap-8">
        <div className=''>
          <p className="text-sm font-medium text-muted-foreground mb-2">Institution Information</p>
          <h2 className="">{data.institutionName}</h2>
          <p className="">{data.institutionAddress}</p>
        </div>
        <Suspense fallback={<p>Loading user information</p>}>
          <UserInformationSection id={data.userId} />
        </Suspense>
      </div>
    </section>
  );
}

function UserInformationSection ({id} : {id: Id<"users">}) {

  const data = useQuery(api.users.getUserById, {id})

  return (
    <div className=''>
      <p className="text-sm font-medium text-muted-foreground mb-2">Requester Information</p>
      <h2 className="">{data?.firstName + " " + data?.lastName}</h2>
      <p className="">{data?.email}</p>
    </div>
  )
}