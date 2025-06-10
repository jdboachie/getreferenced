import React from 'react'
import ThemeToggle from '../theme/theme-toggle'
import { Button } from '../ui/button'

const Footer = () => {
  return (
    <footer className='bg-background border-t p-3 max-sm:pb-4 sm:p-5 sm:pb-6 gap-2.5 sm:gap-5 grid place-items-center'>
      <div className='flex justify-between w-full items-center pr-2'>
        <Button variant={'ghost'} size={'sm'} className='px-2 flex text-blue-500 hover:text-blue-500 gap-2 text-sm items-center'><span className="size-2.5 bg-blue-500 rounded-full"/> All systems normal</Button>
        <ThemeToggle />
      </div>
      <div className="w-full flex justify-start px-2">
        <p className='text-xs text-center text-muted-foreground'>&copy; 2025, Augustine Sandra & Jude.</p>
      </div>
    </footer>
  )
}

export default Footer