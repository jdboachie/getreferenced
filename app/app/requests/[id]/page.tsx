'use client'

import React from 'react'
import Loading from './loading'
import Link from 'next/link'
import { useQuery } from 'convex/react'
import { useRole } from '@/hooks/use-role'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { Button, buttonVariants } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { UserSwitchIcon } from "@phosphor-icons/react"


export default function Page({
  params: asyncParams,
}: {
  params: Promise<{ id: Id<"requests">}>
}) {
  const { id } = React.use(asyncParams)
  const { role } = useRole()
  const data = useQuery(api.requests.getRequestById, { id })

  if (data === undefined) return <Loading />;
  if (data === null) return <p className="text-destructive">Request not found.</p>;

  return (
    <section className='grid gap-8'>
      <div className='flex justify-end gap-2'>
        {role === 'requester' &&
          <>
            <Button disabled size="lg" variant="outline"><UserSwitchIcon size={32} /> Re-assign</Button>
            <Link
              className={`${buttonVariants({ size: "lg", variant: "default" })} max-md:size-10 max-md:px-0`}
              prefetch
              href="/app/requests/new"
            >
              <PlusIcon className="size-5" />
              <span className="max-md:hidden">New request</span>
            </Link>
          </>
        }
      </div>
      <div className="w-full flex flex-col gap-8">
        <div className=''>
          <p className="text-sm font-medium text-muted-foreground mb-2">Institution Information</p>
          <h2 className="">{data.institutionName}</h2>
          <p className="">{data.institutionAddress}</p>
        </div>
        <UserInformationSection id={data.userId} />
      </div>
    </section>
  );
}

function UserInformationSection ({id} : {id: Id<"users">}) {

  const data = useQuery(api.users.getUserById, {id})

  return (
    <div className=''>
      <p className="text-sm font-medium text-muted-foreground mb-2">Requester Information</p>
      {data ?
        <>
          <h2 className="">{data.firstName + " " + data.lastName}</h2>
          <p className="">{data.email}</p>
        </>
        :
        <>
          <Skeleton className='w-full max-w-72' />
          <Skeleton className='w-full max-w-72' />
        </>
        }
    </div>
  )
}