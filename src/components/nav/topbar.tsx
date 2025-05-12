import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Avatar from "boring-avatars";
import { Button } from "../ui/button";
// import Breadcrumbs from "./breadcrumbs";
import { BellIcon } from "../icons/bell";
import ThemeToggle from '../theme/theme-toggle';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { SidebarTrigger } from "../ui/sidebar";


const Topbar = () => {
  return (
    <div className='p-1 pb-2 flex justify-between'>
      <SidebarTrigger />
      {/* <Breadcrumbs /> */}
      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button size={'icon'} variant={'ghost'} className='rounded-full'>
              <BellIcon className='size-full grid place-items-center rounded-full' />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className='text-muted-foreground'>No new notifications.</PopoverContent>
        </Popover>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={'outline'} size={'icon'} className="rounded-full p-1">
              <Avatar name={Math.random().toString()} variant="marble" size={24} className='rounded-full size-full' />
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