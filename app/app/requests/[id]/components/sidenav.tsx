'use client'

import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useRole } from "@/hooks/use-role";
import { Skeleton } from "@/components/ui/skeleton";
import { ClockCounterClockwiseIcon, ListBulletsIcon, FileDashedIcon } from "@phosphor-icons/react";


export default function Sidenav() {
  const pathname = usePathname()
  const segments = pathname.split('/')
  const id = segments[3] // assuming /app/requests/:id

  const { role, loading } = useRole();

  const commonLinks = [
    {
      label: 'Details',
      href: `/app/requests/${id}`,
      icon: ListBulletsIcon,
    },
    {
      label: 'History',
      href: `/app/requests/${id}/history`,
      icon: ClockCounterClockwiseIcon,
    },
  ]

  const requesterLinks = [
    ...commonLinks,
  ]

  const recommenderLinks = [
    ...commonLinks,
    { label: 'Draft', href: `/app/requests/${id}/draft`, icon: FileDashedIcon },
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
    <nav className="lg:w-full lg:max-w-56 h-fit flex flex-col gap-2 lg:sticky lg:top-38">
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
            "justify-start shadow-none",
            pathname !== link.href ? "text-muted-foreground" : "bg-neutral-200/80 hover:bg-neutral-200/50 dark:hover:bg-secondary/80 dark:bg-secondary"
          )}
        >
          <link.icon size={32} weight="bold" className="size-4.5" />
          {link.label}
        </Link>
      ))}
    </nav>
  )
}
