import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import Navbar from './navbar';
import UserButton from "../auth/user-button";
import { Button } from "@/components/ui/button";
import { LeafyGreenIcon } from "lucide-react";
import { BellIcon } from "lucide-react"

function Header() {
  return (
    <header className='sticky top-0 z-50 border-b bg-background'>
      <div className='flex justify-between items-center p-4'>
        <LeafyGreenIcon className="size-5 stroke-2" />
        <div className="flex items-center gap-2">
          <Button variant={"ghost"} className="text-muted-foreground">
            Feedback
          </Button>
          {/* <Button variant={"ghost"} className="text-muted-foreground">
            Help
          </Button> */}
          <Popover>
            <PopoverTrigger asChild className="max-sm:hidden">
              <Button variant={"outline"} size={"icon"} className="shadow-none rounded-full">
                <BellIcon className="size-4" />
                {/* <BellIconSolid className="hidden dark:flex size-4" /> */}
                <span className="sr-only">Notifications</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="text-muted-foreground">No notifications yet</PopoverContent>
          </Popover>
          <Drawer>
            <DrawerTrigger asChild className="sm:hidden">
              <Button variant={"outline"} size={"icon"} className="shadow-none rounded-full">
                <BellIcon className="size-4" />
                {/* <BellIconSolid className="hidden dark:flex size-4" /> */}
                <span className="sr-only">Notifications</span>
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Notifications</DrawerTitle>
                {/* <DrawerDescription>This action cannot be undone.</DrawerDescription> */}
              </DrawerHeader>
              <div className="p-4 min-h-[60dvh] grid place-items-center text-sm text-muted-foreground">
                No notifications yet.
              </div>
              <DrawerFooter className="w-full">
                <DrawerClose asChild>
                  <Button variant="outline" size={'lg'} className="w-full rounded-b-3xl">Close</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
          <UserButton />
        </div>
      </div>
      <Navbar />
    </header>
  )
}

export default Header