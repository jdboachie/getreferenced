import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Navbar from './navbar';
import UserButton from "../auth/user-button";
import { Button } from "@/components/ui/button";
import { LeafyGreenIcon } from "lucide-react";
import { BellIcon } from "@heroicons/react/24/outline"
import { BellIcon as BellIconSolid } from "@heroicons/react/24/solid"


function Header() {
  return (
    <header className='sticky top-0 z-50 border-b bg-background'>
      <div className='flex justify-between items-center p-4'>
        <LeafyGreenIcon className="size-5 stroke-[1.5]" />
        <div className="flex items-center gap-2">
          <Button variant={"outline"} className="text-muted-foreground">
            Feedback
          </Button>
          <Button variant={"ghost"} className="text-muted-foreground">
            Help
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant={"outline"} size={"icon"} className="shadow-none rounded-full">
                <BellIcon className="dark:hidden" />
                <BellIconSolid className="hidden dark:flex" />
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