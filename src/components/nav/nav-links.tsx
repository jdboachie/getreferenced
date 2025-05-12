'use client';

import {
  Calendar,
  CoinsIcon,
  FileIcon,
  AlarmClockIcon,
  User2Icon
} from "lucide-react"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation";


const links = [
  {
    title: "Requests",
    url: "/requests",
    icon: FileIcon,
  },
  {
    title: "Deadlines",
    url: "/deadlines",
    icon: AlarmClockIcon,
  },
  {
    title: "Meetings",
    url: "/meetings",
    icon: Calendar,
  },
  {
    title: "Billing",
    url: "/billing",
    icon: CoinsIcon,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User2Icon,
  },
]

const NavLinks = () => {

  const pathname = usePathname()

  return (
    <SidebarMenu>
      {links.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton isActive={pathname === item.url}  asChild>
            <Link
              prefetch={true}
              href={item.url}
              // className={`border ${pathname === item.url ? 'bg-background border' : 'border-transparent'}`}
            >
              <item.icon />
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}

export default NavLinks