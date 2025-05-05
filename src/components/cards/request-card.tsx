import React from 'react'
import { AlarmClockIcon } from '@/components/icons/alarm-clock'
import Avatar from 'boring-avatars'
import Link from 'next/link'

export interface Request {
  institutionName: string
  institutionAdress: string
  purpose: 'admission' | 'scholarship' | 'job' | 'other'
  deadline: string
  recommender: string
  status: string
}

const RequestCard = () => {
  return (
    <div className='border rounded-lg bg-background p-4'>
      <h3 className="text-sm sm:text-base font-medium">Kwame Nkrumah University of Science & Technology</h3>
      <address className='text-xs sm:text-sm max-sm:pb-2 text-muted-foreground not-italic'>05 South Ofankor, Kumasi, Ghana</address>
      <p className='max-sm:hidden text-xs text-muted-foreground my-2'>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aliquid autem illo ad officiis cumque inventore sapiente tempore quia est aut.
      </p>
      <div className='flex items-end justify-between gap-2'>
        <Link prefetch={true} href={'/deadlines'} className='flex items-center gap-1'>
          <AlarmClockIcon className='[&_svg]:size-3' />
          <p className='text-sm'>In 2 weeks</p>
        </Link>
        <div className="flex recolist gap-2">
          <Avatar name={Math.random().toString()} variant='beam' size={40} className="translate-x-8 z-[3] size-7 sm:size-10 rounded-full bg-muted border outline-2 outline-neutral-400" />
          <Avatar name={Math.random().toString()} variant='beam' size={40} className="translate-x-4 z-[2] size-7 sm:size-10 rounded-full bg-muted border outline-2 outline-yellow-500" />
          <Avatar name={Math.random().toString()} variant='beam' size={40} className="translate-x-0 z-[1] size-7 sm:size-10 rounded-full bg-muted border outline-2 outline-green-500" />
        </div>
      </div>
    </div>
  )
}

export default RequestCard