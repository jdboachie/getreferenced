import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Navbar from './navbar'
import { Button } from "@/components/ui/button"
import { BadgeIcon, BellIcon } from "lucide-react"
import UserButton from "../auth/user-button";


function Header() {
  return (
    <header className='sticky top-0 z-50 border-b bg-surface'>
      <div className='flex justify-between items-center p-4'>
        <BadgeIcon className="size-8 stroke-[1.5]" />
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1 mr-2">
            <Button variant={"ghost"} className="text-muted-foreground">
              Feedback
            </Button>
            <Button variant={"ghost"} className="text-muted-foreground">
              Help
            </Button>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant={"outline"} size={"icon"} className="shadow-2xs active:shadow-none active:translate-y-[1px] rounded-full">
                <BellIcon />
                <span className="sr-only">Notifications</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="text-muted-foreground">No notifications yet</PopoverContent>
          </Popover>
          <UserButton />
        </div>
      </div>
      <Navbar />
    </header>
  )
}

export default Header