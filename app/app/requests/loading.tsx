import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

function Loading() {
  return (
    <div className='grid gap-8'>
      <Skeleton className="h-10" />
      <div className='grid gap-4 lg:grid-cols-2 w-full'>
        <Skeleton className="h-34" />
        <Skeleton className="h-34" />
        <Skeleton className="h-34" />
        <Skeleton className="h-34" />
        <Skeleton className="h-34" />
        <Skeleton className="h-34" />
      </div>
    </div>
  )
}

export default Loading