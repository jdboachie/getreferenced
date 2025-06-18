'use client';

import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { CreditCardIcon, FolderOpenIcon, UserRoundCogIcon } from "lucide-react";

export const Sidenav = () => {
  const pathname = usePathname();

  const links = [
    {
      href: "/app/account",
      label: "Profile",
      icon: UserRoundCogIcon
    },
    {
      href: "/app/account/files",
      label: "Files",
      icon: FolderOpenIcon
    },
    {
      href: "/app/account/billing",
      label: "Billing",
      icon: CreditCardIcon
    },
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
              size: "sm",
              variant: pathname === link.href ? "secondary" : "ghost",
            }),
            "lg:justify-start lg:h-10",
            pathname !== link.href && "text-muted-foreground"
          )}
        >
          <link.icon className="size-4.5" />
          {link.label}
        </Link>
      ))}
    </nav>
  );
};

