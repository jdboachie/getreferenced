'use client';

import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import { SlashIcon } from "lucide-react";

const capitalize = (s: string) =>
  s
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

const Breadcrumbs = () => {

  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  return (
    <Breadcrumb className="pb-10 pt-8">
      {segments.length === 1 ?
        <BreadcrumbList>
          <BreadcrumbPage className="text-2xl sm:text-3xl font-medium">Overview</BreadcrumbPage>
        </BreadcrumbList>
        :
        // TODO: FIX THE SEMANTICS HERE
        <BreadcrumbList>
          {segments.slice(1).map((segment, index) => {
            const href = '/' + segments.slice(0, index + 2).join('/');
            const isFirst = index === 0;
            const isLast = index === segments.length - 2;

            return (
              <div key={href} className="flex items-center gap-2">
                {!isFirst &&
                  <BreadcrumbSeparator className="[&>svg]:size-6">
                    <SlashIcon className="stroke-[1.5]" />
                  </BreadcrumbSeparator>
                }
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage className="text-2xl sm:text-3xl font-medium">{capitalize(segment)}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link prefetch className="text-2xl sm:text-3xl font-medium" href={href}>{capitalize(segment)}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </div>
            );
          })}
        </BreadcrumbList>
      }
    </Breadcrumb>
  );
};

export default Breadcrumbs;