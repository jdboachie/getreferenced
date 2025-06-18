import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

function Loading() {
  return (
    <Skeleton className='min-h-[calc(100dvh-400px)]' />
  )
}

export default Loading