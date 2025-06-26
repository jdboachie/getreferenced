'use client';

import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery } from 'convex/react';
import { useRole } from '@/hooks/use-role';
import { api } from '@/convex/_generated/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import StatusBadge from "@/components/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ListIcon, LayoutGridIcon, SearchIcon, AlarmClockIcon, ArrowUpDownIcon } from 'lucide-react';

export default function Page() {
  const { role } = useRole();
  const endpoint =
    role === "requester"
      ? api.requests.getRequestsByUser
      : api.requests.getRequestsByRecommender;

  const requests = useQuery(endpoint);
  const isLoading = requests === undefined;

  const searchParams = useSearchParams();
  const router = useRouter();
  const view = searchParams.get('view') ?? 'grid';

  const updateView = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('view', value);
    router.push(`?${params.toString()}`);
  };

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
                <ArrowUpDownIcon />
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
                <DropdownMenuItem onClick={() => updateView('grid')}>Grid</DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateView('list')}>List</DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <ToggleGroup
            type="single"
            size="lg"
            variant="outline"
            value={view}
            onValueChange={(val) => val && updateView(val)}
            className="max-md:hidden"
          >
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
        <div className={`${view === 'grid' ? 'grid lg:grid-cols-2' : 'flex flex-col'} gap-4 w-full`}>
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
        <ul
          data-view={view}
          className="
            w-full grid rounded-md
            data-[view=grid]:grid lg:data-[view=grid]:grid-cols-2 data-[view=grid]:gap-4
            data-[view=list]:flex data-[view=list]:flex-col
            data-[view=list]:border data-[view=list]:rounded-lg data-[view=list]:bg-background data-[view=list]:divide-y
          "
        >
          {requests?.map((req) => (
            <li
              key={req._id}
              className="relative grid h-fit"
            >
              <Link
                href={`/app/requests/${req._id}`}
                data-view={view}
                className="size-full p-4 data-[view=grid]:bg-background hover:bg-background/80 transition
                  grid gap-2
                  data-[view=list]:flex data-[view=list]:justify-between data-[view=grid]:border data-[view=grid]:rounded-lg
                  data-[view=list]:max-lg:flex-col data-[view=list]:max-lg:gap-1"
              >
                <div
                  data-view={view}
                  className="grid gap-0.5
                    data-[view=list]:flex data-[view=list]:lg:items-center
                    data-[view=list]:max-lg:flex-col data-[view=list]:lg:gap-2"
                >
                  <p>{req.institutionName}</p>
                  <p className="text-sm text-muted-foreground truncate">{req.institutionAddress}</p>
                </div>
                <div
                  data-view={view}
                  className="text-sm flex items-center justify-between
                    data-[view=list]:gap-2"
                >
                  <span className="flex gap-1.5 items-center">
                    <AlarmClockIcon className="size-4" /> Due: {new Date(req.deadline).toLocaleDateString()}
                  </span>
                  <StatusBadge status={req.status} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      }

    </section>
  )
}
