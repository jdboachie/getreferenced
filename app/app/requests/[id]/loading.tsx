import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

function Loading() {
  return (
    <div className='grid gap-16'>
      <div className='grid gap-8 pt-5'>
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
  )
}

export default Loading