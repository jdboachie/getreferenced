'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRole } from '@/hooks/use-role';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { ListIcon, LayoutGridIcon, SearchIcon, AlarmClockIcon, FilterIcon } from 'lucide-react';
import StatusBadge from "@/components/status-badge";
import { Skeleton } from "@/components/ui/skeleton";


export default function Page() {

  const { role } = useRole();
  const endpoint =
    role === "requester"
      ? api.requests.getRequestsByUser
      : api.requests.getRequestsByRecommender;

  const requests = useQuery(endpoint);
  const isLoading = requests === undefined;

  return (
    <section className="flex flex-col gap-8">
      {/* top bar */}
      <div className="w-full flex justify-between gap-2">
        <div className='w-full lg:max-w-md relative bg-background rounded-md'>
          <Input className='w-full px-10' placeholder='Search requests...' />
          <SearchIcon className='absolute inset-3 size-4 text-muted-foreground' />
        </div>
        <div className="flex gap-2 items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="outline" className="size-10">
                <FilterIcon className="h-4 w-4" />
                <span className="sr-only">Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Institution</DropdownMenuItem>
              <DropdownMenuItem>Recommender</DropdownMenuItem>
              <DropdownMenuItem>Deadline</DropdownMenuItem>
              <DropdownMenuItem>Status</DropdownMenuItem>
              <div className="mt-2 md:hidden">
                <DropdownMenuLabel>View</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Grid</DropdownMenuItem>
                <DropdownMenuItem>List</DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <ToggleGroup type="single" size="lg" variant={'outline'} defaultValue="grid" className="max-md:hidden">
            <ToggleGroupItem value="grid" aria-label="Toggle grid view">
              <LayoutGridIcon className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="Toggle list view">
              <ListIcon className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>


      {isLoading &&
        <div className="grid gap-4 lg:grid-cols-2 w-full">
          <Skeleton className="h-34 w-full" />
          <Skeleton className="h-34 w-full" />
          <Skeleton className="h-34 w-full" />
          <Skeleton className="h-34 w-full" />
          <Skeleton className="h-34 w-full" />
        </div>
      }


      {!isLoading && requests?.length === 0 && (
        <p className="text-muted-foreground text-sm">No requests found.</p>
      )}

      {!isLoading &&
        <ul className="grid gap-4 lg:grid-cols-2 w-full">
          {requests?.map((req) => (
            <li
              key={req._id}
              className="grid border bg-background rounded-lg h-fit hover:bg-background/80 transition"
            >
              <Link href={`/app/requests/${req._id}`} className="space-y-2 size-full p-4">
                <div className='grid gap-0.5 w-full'>
                  <p className="">{req.institutionName}</p>
                  <p className="text-sm text-muted-foreground">{req.institutionAddress}</p>
                </div>
                <StatusBadge status={req.status} />
                <p className="text-sm flex gap-1.5 items-center">
                  <AlarmClockIcon className="size-4" /> Due: {new Date(req.deadline).toLocaleDateString()}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      }
    </section>
  )
}
