'use client';

import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const navLinks = [
  {
    title: "Overview",
    url: "/",
  },
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

  const containerRef = useRef<HTMLDivElement>(null)

  const pathname = usePathname();
  const isActive = (url: string) => {
    if (url === "/") {
      return pathname === url;
    }
    return pathname.startsWith(url);
  };

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return
      e.preventDefault()
      el.scrollLeft += e.deltaY
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  return (
    <nav
      ref={containerRef}
      className="flex p-2 overflow-x-scroll hidden-scrollbar"
    >
      {navLinks.map((link) => (
        <Link
          prefetch
          key={link.title}
          href={link.url}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            !isActive(link.url) && "text-muted-foreground",
            'font-normali relative duration-500',
          )}
        >
          {isActive(link.url) && <div className="pointer-events-none absolute -bottom-2 w-full h-0.5 rounded-full bg-pink-500" />}
          {link.title}
        </Link>
      ))}
    </nav>
  );
}
