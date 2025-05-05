import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Avatar from "boring-avatars";
import { SidebarTrigger } from '../ui/sidebar';
import ThemeToggle from '../theme/theme-toggle';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { BellIcon } from "../icons/bell";

const Topbar = () => {
  return (
    <div className='p-4 z-50 bg-background mb-2 flex justify-between sticky top-0 right-0 topbar'>
      <SidebarTrigger />
      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button size={'icon'} variant={'outline'} className='rounded-full'>
              <BellIcon className='size-full grid place-items-center rounded-full' />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className='text-muted-foreground'>No new notifications.</PopoverContent>
        </Popover>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={'outline'} size={'icon'} className="rounded-full p-1">
              <Avatar name={Math.random().toString()} size={24} className='rounded-full size-full' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>jboachie@st.knust.edu.gh</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuSeparator />
            <div className="flex justify-between items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none"><span className="text-sm">Theme</span><ThemeToggle /></div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default Topbar