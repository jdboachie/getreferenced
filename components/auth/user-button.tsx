'use client';

import Link from "next/link";
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

  const router = useRouter();
  const isMobile = useIsMobile();
  const { signOut } = useAuthActions();

  const user = useQuery(api.users.getCurrentUser);
  const imageUrl = useQuery(api.storage.getFileUrl, { src: user?.image })


  if (!user) return <div className="size-9 rounded-full animate-pulse bg-accent border" />;

  return (
    isMobile ?
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" size={"icon"} className="rounded-full shadow-none place-items-center grid ">
          {imageUrl ?
            <Avatar>
              <AvatarImage alt="avatar" src={imageUrl} onError={() => console.log("error")} />
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
        <DrawerHeader className="sr-only">
          <DrawerTitle>User menu</DrawerTitle>
          <DrawerDescription>Navigate the app or logout here.</DrawerDescription>
        </DrawerHeader>
        <div className="p-4 grid gap-2 mt-4">
          <div className="flex gap-2 items-center mb-4">
            {imageUrl ?
              <Avatar className="size-12 border">
                <AvatarImage alt="avatar" src={imageUrl} />
                <AvatarFallback><User2Icon /></AvatarFallback>
              </Avatar>
              :
              <Avatar
              >
                <AvatarFallback><User2Icon /></AvatarFallback>
              </Avatar>
            }
            <div>
              <p className="px-2">{user.firstName}{" "}{user.lastName}</p>
              <p className="px-2 mb-2 text-muted-foreground text-sm">{user.email}</p>
            </div>
          </div>
          <DrawerClose asChild>
            <Link href="/app" className={`justify-start rounded-md text-base font-normal h-10 inline-flex items-center px-2`}>
              Overview
            </Link>
          </DrawerClose>
          <DrawerClose asChild>
            <Link href="/app/requests" className={`justify-start rounded-md text-base font-normal h-10 inline-flex items-center px-2`}>
              Requests
            </Link>
          </DrawerClose>
          <DrawerClose asChild>
            <Link href="/app/account" className={`justify-start rounded-md text-base font-normal h-10 inline-flex items-center px-2`}>
              Account
            </Link>
          </DrawerClose>
           <div className="flex items-center justify-between px-2 py-1 text-base">
            Theme<ThemeToggle lg />
          </div>
          <DrawerClose asChild>
            <button
             className="justify-start cursor-pointer rounded-md text-base font-normal h-10 inline-flex items-center px-2"
              onClick={async () =>
                await Promise.all([
                  router.push("/auth"),
                  signOut(),
                ])
              }
            >
              <span className="text-destructive">Log out</span>
              <DropdownMenuShortcut><LogOut className="text-destructive size-4" /></DropdownMenuShortcut>
            </button>
          </DrawerClose>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button size={'lg'} variant="outline" className="rounded-b-3xl">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
    :
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size={"icon"} className="rounded-full shadow-none">
          {imageUrl ?
            <Avatar>
              <AvatarImage alt="avatar" src={imageUrl} onError={() => console.log("error")} />
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
            <Link href="/app/account">
              Account
            </Link>
            {/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
          </DropdownMenuItem>
          <DropdownMenuItem>
            Billing
            {/* <DropdownMenuShortcut>⌘B</DropdownMenuShortcut> */}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <div className="flex items-center justify-between p-2 text-sm">
          Theme<ThemeToggle />
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={async () =>
            await Promise.all([
              router.push("/auth"),
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
