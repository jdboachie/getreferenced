import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className='grid gap-8'>
      <Skeleton className='w-full h-80 sm:min-h-72 rounded-xl'/>
      <Skeleton className='w-full h-80 sm:min-h-72 rounded-xl'/>
      <Skeleton className='w-full h-80 sm:min-h-72 rounded-xl'/>
      <Skeleton className='w-full h-80 sm:min-h-72 rounded-xl'/>
    </div>
  )
}