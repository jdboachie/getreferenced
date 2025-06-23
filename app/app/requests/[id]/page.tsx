'use client'

import React from 'react'
import Loading from './loading'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { Skeleton } from '@/components/ui/skeleton'
import { capitalize } from '@/lib/utils'
import { useRole } from '@/hooks/use-role'


export default function Page({
  params: asyncParams,
}: {
  params: Promise<{ id: Id<"requests">}>
}) {
  const { role } = useRole();
  const { id } = React.use(asyncParams)
  const data = useQuery(api.requests.getRequestById, { id })

  if (data === undefined) return <Loading />;
  if (data === null) throw new Error('Request not found');

  return (
    <section className='grid'>
      <div className="w-full flex flex-col gap-16">
        <div className=''>
          <p className="text-sm font-medium text-muted-foreground mb-2">Institution</p>
          <ul className='flex flex-col sm:gap-1 gap-5'>
            <DataRow name={'Name'} value={data.institutionName} />
            <DataRow name={'Address'} value={data.institutionAddress} />
            <DataRow name={'Purpose'} value={capitalize(data.purpose)} />
            <DataRow name={'Deadline'} value={(new Date(data.deadline)).toUTCString()} />
          </ul>
        </div>
        {role !== 'requester' && <RequesterInformationSection id={data.userId} />}
      </div>
    </section>
  );
}

function RequesterInformationSection ({id} : {id: Id<"users">}) {

  const profile = useQuery(api.users.getRequesterProfileById, { userId: id })

  return (
    <div className=''>
      <p className="text-sm font-medium text-muted-foreground mb-2">Requester</p>
      {profile ?
        <ul className='flex flex-col sm:gap-1 gap-5'>
          <DataRow name='Full name' value={profile.firstName + " " + profile.lastName} />
          <DataRow name='Email' value={profile.email} />
          <DataRow name='Year of completion' value={profile.yearOfCompletion} />
          <DataRow name='Program of study' value={profile.programOfStudy} />
          <DataRow name='Index number' value={profile.indexNumber} />
          <DataRow name='Student Number' value={profile.studentNumber} />
        </ul>
        :
        <>
          <Skeleton className='w-full max-w-72' />
          <Skeleton className='w-full max-w-72' />
          <Skeleton className='w-full max-w-72' />
        </>
        }
    </div>
  )
}

function DataRow ({name, value}: {name: string, value?: string}) {
  return (
    <li className="flex max-sm:grid items-start sm:gap-1">
      <span className="min-w-38 text-muted-foreground">{name}</span>
      <span>{value}</span>
    </li>
  )
}