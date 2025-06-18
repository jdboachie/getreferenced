'use client'

import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useRole } from "@/hooks/use-role";


export default function Sidenav() {
  const pathname = usePathname()
  const segments = pathname.split('/')
  const id = segments[3] // assuming /app/requests/:id

  const { role, loading } = useRole();

  const commonLinks = [
    { label: 'Details', href: `/app/requests/${id}` },
    { label: 'History', href: `/app/requests/${id}/history` },
  ]

  const requesterLinks = [
    ...commonLinks,
  ]

  const recommenderLinks = [
    ...commonLinks,
    { label: 'Drafts', href: `/app/requests/${id}/drafts` },
  ]

  const links = role === 'requester' ? requesterLinks : recommenderLinks
  if (loading) {
    return (
      <div className="w-72 h-fit flex lg:flex-col gap-2 lg-sticky lg:top-38">
        <div className="h-10 w-full bg-secondary animate-pulse rounded-md" />
        <div className="h-10 w-full bg-secondary animate-pulse rounded-md" />
      </div>
    )
  }
  return (
    <nav className="w-72 h-fit flex lg:flex-col gap-2 lg:sticky lg:top-38">
      {links.map((link) => (
        <Link
          prefetch
          key={link.href}
          href={link.href}
          className={cn(
            buttonVariants({
              size: "lg",
              variant: pathname === link.href ? "secondary" : "ghost",
            }),
            "lg:justify-start bg-background dark:bg-secondary",
            pathname !== link.href && "text-muted-foreground bg-transparent dark:bg-transparent"
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  )
}
