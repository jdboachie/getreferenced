'use client';

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/theme/theme-toggle";
import { useRouter } from "next/navigation";
import { useAuthActions } from '@convex-dev/auth/react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User2Icon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";


export default function UserButton() {

  const isMobile = useIsMobile();

  const router = useRouter();
  const { signOut } = useAuthActions();

  const user = useQuery(api.auth.getCurrentUser);
  const imageUrl = useQuery(api.storage.getFileUrl, { storageId: user?.image})


  if (!user) return <div className="size-9 rounded-full animate-pulse bg-accent border" />;

  return (
    isMobile ?
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" size={"icon"} className="rounded-full shadow-2xs">
          {imageUrl ?
            <Avatar>
              <AvatarImage alt="avatar" src={imageUrl} />
              <AvatarFallback><User2Icon /></AvatarFallback>
            </Avatar>
            :
            <Avatar
            >
              <AvatarFallback><User2Icon /></AvatarFallback>
            </Avatar>
          }
          <span className="sr-only">Open user menu</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>This action cannot be undone.</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
    :
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size={"icon"} className="rounded-full shadow-2xs">
          {imageUrl ?
            <Avatar>
              <AvatarImage alt="avatar" src={imageUrl} />
              <AvatarFallback><User2Icon /></AvatarFallback>
            </Avatar>
            :
            <Avatar
            >
              <AvatarFallback><User2Icon /></AvatarFallback>
            </Avatar>
          }
          <span className="sr-only">Open user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-56">
        <DropdownMenuLabel className="pb-0">{user.firstName}{" "}{user.lastName}</DropdownMenuLabel>
        <DropdownMenuLabel className="pt-0 text-muted-foreground font-normal">{user.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Account
            {/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
          </DropdownMenuItem>
          <DropdownMenuItem>
            Billing
            {/* <DropdownMenuShortcut>⌘B</DropdownMenuShortcut> */}
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            {/* <DropdownMenuShortcut>⌘S</DropdownMenuShortcut> */}
          </DropdownMenuItem>
          <DropdownMenuItem>
            Keyboard shortcuts
            {/* <DropdownMenuShortcut>⌘K</DropdownMenuShortcut> */}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <div className="flex items-center justify-between pl-2 py-1 text-sm">
          Theme<ThemeToggle />
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={async () =>
            await Promise.all([
              router.push("/"),
              signOut(),
            ])
          }
        >
          Log out
          <DropdownMenuShortcut><LogOut className="text-destructive" /></DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
