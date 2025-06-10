'use client';

import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { usePathname } from "next/navigation";

export const Sidenav = () => {
  const pathname = usePathname();

  const links = [
    { href: "/app/account", label: "Profile" },
    { href: "/app/account/files", label: "Files" },
    { href: "/app/account/billing", label: "Billing" },
  ];

  return (
    <nav className="w-72 h-fit flex lg:flex-col gap-2 lg:sticky lg:top-38">
      {links.map((link) => (
        <Link
          prefetch
          key={link.href}
          href={link.href}
          className={cn(
            buttonVariants({
              size: "default",
              variant: pathname === link.href ? "secondary" : "ghost",
            }),
            "lg:justify-start",
            pathname !== link.href && "text-muted-foreground"
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
};

