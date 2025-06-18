'use client'

import { useLinkStatus } from 'next/link'

export default function LoadingIndicator() {
  const { pending } = useLinkStatus()

  return pending ? (
    <div role="status" aria-label="Loading" className="h-3 rounded-md w-32 sm:w-56 bg-secondary animate-pulse" />
  )
  :
  null
}