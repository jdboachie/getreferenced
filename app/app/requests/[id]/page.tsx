'use client'

import * as React from 'react';
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

  if (data === undefined) return (
    <div className='grid gap-16'>
      <div className='grid gap-8 pt-5'>
        <Skeleton className='h-8 w-full' />
        <Skeleton className='h-8 w-full' />
        <Skeleton className='h-8 w-full' />
        <Skeleton className='h-8 w-full' />
      </div>
      <div className='grid gap-8 pt-5'>
        <Skeleton className='h-8 w-full' />
        <Skeleton className='h-8 w-full' />
        <Skeleton className='h-8 w-full' />
      </div>
    </div>
  );
  if (data === null) throw new Error('Request not found');

  return (
    <section className='grid'>
      <div className="w-full flex flex-col gap-16">
        <div className=''>
          <p className="text-sm font-medium text-muted-foreground mb-2">Institution</p>
          <ul className='flex flex-col sm:gap-1 gap-5 odd:bg-accent'>
            <DataRow name={'Name'} value={data.institutionName} />
            <DataRow name={'Address'} value={data.institutionAddress} />
            <DataRow name={'Purpose'} value={capitalize(data.purpose)} />
            <DataRow name={'Deadline'} value={(new Date(data.deadline)).toUTCString()} />
            <DataRow name={'Additional Info'} value={data.additionalInfo} />
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
        <div className='grid gap-8 pt-5'>
          <Skeleton className='h-8 w-full' />
          <Skeleton className='h-8 w-full' />
          <Skeleton className='h-8 w-full' />
        </div>
        </>
        }
    </div>
  )
}

function DataRow ({name, value}: {name: string, value?: string}) {
  return (
    <li className="flex max-sm:grid items-start sm:gap-1 odd:bg-accent/60 dark:odd:bg-accent/40 p-1 px-2 rounded-sm">
      <span className="min-w-38 text-muted-foreground">{name}</span>
      <span>{value}</span>
    </li>
  )
}