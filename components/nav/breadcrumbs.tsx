'use client';

import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const capitalize = (s: string) =>
  s
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

const Breadcrumbs = () => {

  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  return (
    <Breadcrumb className="mb-8 mt-4">
      <BreadcrumbList>
        {segments.length === 1 ? (
          <BreadcrumbPage className="text-2xl sm:text-3xl font-medium">Overview</BreadcrumbPage>
        ) :
          <>
            {segments.slice(1).map((segment, index) => {
              const href = '/' + segments.slice(0, index + 2).join('/');
              const isFirst = index === 0;
              const isLast = index === segments.length - 2;

              return (
                <div key={href} className="flex items-center gap-1">
                  {!isFirst &&
                    <BreadcrumbSeparator className="[&>svg]:size-6">
                      <ChevronRightIcon className="stroke-2" />
                    </BreadcrumbSeparator>
                  }
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage className="text-2xl sm:text-3xl font-medium">{capitalize(segment)}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link className="text-2xl sm:text-3xl font-medium" href={href}>{capitalize(segment)}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </div>
              );
            })}
          </>
        }
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default Breadcrumbs;