import React from 'react'
import { DataRow } from './data-row'
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Skeleton } from "@/components/ui/skeleton";

export default function PersonalDetailsCard() {

  const user = useQuery(api.users.getCurrentUser)
  const profile = useQuery(api.users.getRequesterProfile)

  if (user === undefined || profile === undefined) {
    return (
      <div id="personal" className="p-5 pb-6 rounded-md border bg-background shadow-xs grid gap-8">
        <div className='flex flex-col gap-2'>
          <Skeleton className="h-7 w-36 rounded-sm" />
          <Skeleton className="h-7 w-72 rounded-sm" />
        </div>
        <div className="grid gap-9 mt-6 mb-9">
          <Skeleton className="h-8 rounded-sm" />
          <Skeleton className="h-8 rounded-sm" />
          <Skeleton className="h-8 rounded-sm" />
        </div>
        <div className="grid gap-9 mt-6 mb-9">
          <Skeleton className="h-8 rounded-sm" />
          <Skeleton className="h-8 rounded-sm" />
          <Skeleton className="h-8 rounded-sm" />
        </div>
      </div>
    )
  }

  return (
    <div id="profile" className="p-5 rounded-md border bg-background shadow-xs grid gap-8">
      <div className='flex flex-col gap-2'>
        <h3>Profile</h3>
        <p className='text-sm'>Verify these details. Contact support if you need assistance.</p>
      </div>
      <div className='grid gap-2'>
        <p className="text-sm font-medium">Personal details</p>
        <ul className="grid gap-1 max-sm:gap-2">
          <DataRow name={'First Name'} value={user?.firstName} />
          <DataRow name={'Last Name'} value={user?.lastName} />
          <DataRow name={'Other Names'} value={user?.otherNames} />
          <DataRow name={'Index Number'} value={profile?.indexNumber} />
          <DataRow name={'Student Number'} value={profile?.studentNumber} />
          <DataRow name={'Program of Study'} value={profile?.programOfStudy} />
        </ul>
      </div>
      <div className='grid gap-2'>
        <p className="text-sm font-medium">Documents</p>
        <ul className="grid gap-1 max-sm:gap-2">

        </ul>
      </div>
    </div>
  )
}
