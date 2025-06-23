'use client';

import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";

type NavLink = {
  href: string;
  label: string;
  icon?: LucideIcon;
};

type SidenavProps = {
  links: NavLink[];
};

export function Sidenav ({ links }: SidenavProps) {

  const pathname = usePathname();

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
            "justify-start shadow-none",
            pathname !== link.href ? "text-muted-foreground" : "bg-neutral-200/80 hover:bg-neutral-200/50 dark:hover:bg-secondary/80 dark:bg-secondary"
          )}
        >
          {link.icon && <link.icon className="size-4.5" />}
          {link.label}
        </Link>
      ))}
    </nav>
  );
};
