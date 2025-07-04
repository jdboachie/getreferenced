'use client';

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { useRole } from "@/hooks/use-role";
import { usePathname } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";

const commonNavLinks = [
  { title: "Overview", url: "/app" },
  { title: "Requests", url: "/app/requests" },
  { title: "Account", url: "/app/account" },
];

const requesterNavLinks = [...commonNavLinks];
const recommenderNavLinks = [...commonNavLinks, { title: "Drafts", url: "/app/drafts" }];

export default function Navbar() {
  const { role } = useRole();
  const navLinks = role ? (role === "requester" ? requesterNavLinks : recommenderNavLinks) : commonNavLinks

  const containerRef = useRef<HTMLDivElement>(null)
  const underlineRef = useRef<HTMLSpanElement>(null)
  const pathname = usePathname();
  const isActive = (url: string) => url === "/app" ? pathname === url : pathname.startsWith(url);

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

  useEffect(() => {
    const container = containerRef.current
    const underline = underlineRef.current
    if (!container || !underline) return

    const activeLink = container.querySelector(".active-link") as HTMLElement
    if (activeLink) {
      underline.style.width = `${activeLink.offsetWidth}px`
      underline.style.left = `${activeLink.offsetLeft}px`
    }
  }, [pathname, navLinks])

  return (
    <nav
      ref={containerRef}
      className="relative flex p-2 overflow-x-scroll hidden-scrollbar"
    >
      <span
        ref={underlineRef}
        className="absolute bottom-0 h-0.5 bg-primary rounded-full transition-all duration-150 ease-out"
      />
      {navLinks.map((link) => (
        <Link
          prefetch
          key={link.title}
          href={link.url}
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            !isActive(link.url) && "text-muted-foreground",
            isActive(link.url) && "active-link",
            'font-normal relative duration-500'
          )}
        >
          {link.title}
        </Link>
      ))}
    </nav>
  );
}
