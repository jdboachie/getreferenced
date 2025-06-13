import React from 'react'
import ThemeToggle from '../theme/theme-toggle'
import { Button } from '../ui/button'

const Footer = () => {
  return (
    <footer className='bg-background border-t p-5'>
      <div className="grid gap-5 size-full max-w-6xl mx-auto">
        <div className='flex justify-between items-center gap-4 w-full'>
          <Button variant={'ghost'} size={'sm'} className='px-2 flex text-blue-500 hover:text-blue-500 gap-2 text-sm font-normal items-center'><span className="size-2 bg-blue-500 rounded-full"/> All systems normal</Button>
          <ThemeToggle />
        </div>
        <div className="w-full flex justify-start px-2">
          <p className='text-xs text-center text-muted-foreground'>&copy; 2025, Augustine Sandra & Jude.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer