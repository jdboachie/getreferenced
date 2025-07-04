'use client';

import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { useRole } from "@/hooks/use-role";
import { usePathname } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";

const commonNavLinks = [
  {
    title: "Overview",
    url: "/app",
  },
  {
    title: "Requests",
    url: "/app/requests",
  },
  // {
  //   title: "Meetings",
  //   url: "/app/meetings",
  // },
  // {
  //   title: "Billing",
  //   url: "/app/billing",
  // },

  {
    title: "Account",
    url: "/app/account",
  },
]

const requesterNavLinks = [
  ...commonNavLinks
];

const recommenderNavLinks = [
  ...commonNavLinks,
  {
    title: "Drafts",
    url: "/app/drafts",
  },
];


export default function Navbar() {

  const { role } = useRole();

  const navLinks = role ? (role === "requester" ? requesterNavLinks : recommenderNavLinks) : commonNavLinks

  const containerRef = useRef<HTMLDivElement>(null)

  const pathname = usePathname();
  const isActive = (url: string) => {
    if (url === "/app") {
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
            buttonVariants({ variant: "ghost", size: "sm" }),
            !isActive(link.url) && "text-muted-foreground",
            'font-normal relative duration-500',
          )}
        >
          {isActive(link.url) && (
            <motion.span
              layoutId="bubble"
              className="absolute inset-0 h-0.5 top-9.5 z-10 bg-black dark:bg-white mix-blend-difference"
              style={{ borderRadius: 10 }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          {/* {isActive(link.url) && <div className="pointer-events-none absolute -bottom-2 w-full h-0.5 rounded-full bg-primary" />} */}
          {link.title}
        </Link>
      ))}
    </nav>
  );
}
