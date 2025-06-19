'use client'

import React from 'react'
import Loading from './loading'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { Skeleton } from '@/components/ui/skeleton'


export default function Page({
  params: asyncParams,
}: {
  params: Promise<{ id: Id<"requests">}>
}) {
  const { id } = React.use(asyncParams)
  const data = useQuery(api.requests.getRequestById, { id })

  if (data === undefined) return <Loading />;
  if (data === null) return <p className="text-destructive">Request not found.</p>;

  return (
    <section className='grid gap-8'>
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