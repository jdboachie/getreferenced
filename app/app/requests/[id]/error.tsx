'use client'

import { Button } from '@/components/ui/button'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error) // I shouldn't do console logs on client btw
  }, [error])

  return (
    <div className='size-full rounded-xl border-dashed border border-destructive grid place-items-center p-5 sm:p-10 gap-5'>
      <h2>Something went wrong</h2>
      {error.message}
      <Button
        onClick={
          () => reset()
        }
      >
        Refresh
      </Button>
    </div>
  )
}