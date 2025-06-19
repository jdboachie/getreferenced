'use client'

import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useRole } from "@/hooks/use-role";
import { Skeleton } from "@/components/ui/skeleton";


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
    { label: 'Draft', href: `/app/requests/${id}/draft` },
  ]

  const links = role === 'requester' ? requesterLinks : recommenderLinks
  if (loading) {
    return (
      <div className="md:w-72 h-fit flex flex-col gap-2 lg:sticky lg:top-38">
        <Skeleton className="h-10 rounded-md" />
        <Skeleton className="h-10 rounded-md" />
      </div>
    )
  }
  return (
    <nav className="md:w-full md:max-w-56 h-fit flex flex-col gap-2 lg:sticky lg:top-38">
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
            "justify-start",
            pathname !== link.href && "text-muted-foreground"
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  )
}
