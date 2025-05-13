'use client';

import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { usePathname } from "next/navigation";

const navLinks = [
  {
    title: "Requests",
    url: "/requests",
  },
  {
    title: "Deadlines",
    url: "/deadlines",
  },
  {
    title: "Meetings",
    url: "/meetings",
  },
  {
    title: "Billing",
    url: "/billing",
  },
  {
    title: "Profile",
    url: "/profile",
  },
];

export default function Navbar() {

  const pathname = usePathname();

  const isActive = (url: string) => {
    return pathname === url;
  };

  return (
    <nav className="flex p-2">
      {navLinks.map((link) => (
        <Link
          prefetch
          key={link.title}
          href={link.url}
          className={cn(buttonVariants({ variant: isActive(link.url) ? "secondary" : "ghost", size: "sm" }), !isActive(link.url) && "text-muted-foreground")}
        >
          {link.title}
        </Link>
      ))}
    </nav>
  );
}
