'use client';

import Link from 'next/link';
import * as React from 'react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { buttonVariants } from '@/components/ui/button'


interface Tab {
  title: string
  link: string
}

const tabs: Tab[] = [
  {
    title: 'Requests',
    link: '/'
  },
  {
    title: 'Deadlines',
    link: '/deadlines'
  },
  {
    title: 'Meetings',
    link: '/meetings'
  },
  {
    title: 'Billing',
    link: '/billing'
  },
  {
    title: 'Profile',
    link: '/profile'
  },
]


const Nav = () => {

  const pathname = usePathname()

  return (
    <nav className='p-4 py-2 sticky left-0 top-0 z-10 max-w-screen overflow-x-scroll overflow-y-hidden flex border-b bg-background'>
      {tabs.map((tab, index) => (
        <Link
          key={index}
          href={tab.link}
          prefetch={true}
          className={`
            ${buttonVariants({size: 'sm', variant: 'ghost'})}
            ${!pathname.startsWith(tab.link) && 'text-muted-foreground'}
            relative transition-all duration-200 ease-out font-normal
          `}
        >
          <span className='relative z-10'>{tab.title}</span>
            {pathname.startsWith(tab.link) && (
              <motion.div
                transition={{ type: "spring", duration: 0.4 }}
                layoutId="active-pill"
                style={{
                    borderRadius: 9999,
                  }}
                className="bg-primary absolute z-20 left-0 -bottom-2 h-[2px] w-full"
                />
              )}
          </Link>
        ))}
      </nav>
  )
}

export default Nav