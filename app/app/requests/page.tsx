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
import { Button, buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useRole } from '@/hooks/use-role';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { ArrowLeftIcon, ListIcon, LayoutGridIcon, SearchIcon, AlarmClockIcon, FilterIcon, PlusIcon } from 'lucide-react';
import StatusBadge from "@/components/status-badge";


export default function Page() {

  const searchParams = useSearchParams()
  const id = searchParams.get('id') as Id<"requests">

  if (id) {
    return <RequestIDView id={id} />
  }
  return <AllRequestsView />
}

function AllRequestsView() {
  const { role } = useRole();
  const endpoint =
    role === "requester"
      ? api.requests.getRequestsByUser
      : api.requests.getRequestsByRecommender;

  const requests = useQuery(endpoint);
  const isLoading = requests === undefined;

  return (
    <section className="space-y-6">
      <div className="flex gap-2 items-center w-full">
        <div className='w-full relative bg-background rounded-md'>
          <Input className='w-full px-10' placeholder='Search requests...' />
          <SearchIcon className='absolute inset-3 size-4 text-muted-foreground' />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="outline" className="size-10">
              <FilterIcon className="h-4 w-4" />
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
        {role === "requester" && (
          <Link
            className={`${buttonVariants({ size: "lg", variant: "default" })} max-md:size-10 max-md:px-0`}
            prefetch
            href="/app/requests/new"
          >
            <PlusIcon className="size-5 md:hidden" />
            <span className="max-md:hidden">New request</span>
          </Link>
        )}
      </div>

      {isLoading && <p className="text-muted-foreground">Loading...</p>}

      {!isLoading && requests?.length === 0 && (
        <p className="text-muted-foreground text-sm">No requests found.</p>
      )}

      <ul className="space-y-4 grid lg:grid-cols-2">
        {requests?.map((req) => (
          <li
            key={req._id}
            className="border bg-background rounded-lg p-4 hover:bg-background/80 transition"
          >
            <Link href={`/app/requests?id=${req._id}`} className="block space-y-2">
              <div className='grid gap-0.5 w-full'>
                <p className="">{req.institutionName}</p>
                <p className="text-sm text-muted-foreground">{req.institutionAddress}</p>
              </div>
              <StatusBadge status={req.status} />
              {/* {req.additionalInfo &&
              <p className="text-sm p-2 rounded-md bg-muted">Additional info: {req.additionalInfo}</p>
              } */}
              <p className="text-sm">Purpose: {req.purpose ?? "none"}</p>
              <p className="text-sm flex gap-1.5 items-center">
                <AlarmClockIcon className="size-4" /> Due: {new Date(req.deadline).toLocaleDateString()}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function RequestIDView({ id }: { id: Id<"requests"> }) {

  const { role } = useRole();

  const data = useQuery(api.requests.getRequestById, { id });
  const isLoading = data === undefined;
  const isNotFound = data === null;

  if (isLoading) return <p className="text-muted-foreground">Loading...</p>;
  if (isNotFound) return <p className="text-destructive">Request not found.</p>;

  return (
    <section>
      <div className='flex justify-between gap-2'>
        <Link className={cn(buttonVariants({ size: 'icon', variant: 'secondary'}), 'size-10')} prefetch href="/app/requests">
          <ArrowLeftIcon />
        </Link>
        {role === 'requester' &&
          <div className='flex gap-2'>
            <Button size={"lg"} variant={'outline'}>Re-assign</Button>
            <Link
              className={`${buttonVariants({ size: "lg", variant: "default" })} max-md:size-10 max-md:px-0`}
              prefetch
              href="/app/requests/new"
            >
              <PlusIcon className="size-5 md:hidden" />
              <span className="max-md:hidden">New request</span>
            </Link>
          </div>
        }
      </div>
      <div className="space-y-4 mt-6 text-sm">
        <p>
          You are applying to <strong>{data.institutionName}</strong>, located at <strong>{data.institutionAddress}</strong>.
        </p>
        <p>
          The recommendation letter is due by <strong>{new Date(data.deadline).toLocaleDateString()}</strong>.
        </p>
        <p>
          Purpose: <strong>{data.purpose ?? "—"}</strong>
        </p>
        <p>
          Additional info: <strong>{data.additionalInfo ?? "—"}</strong>
        </p>
        <p>
          Sample letter: <strong>{data.sampleLetter ? "Attached" : "None"}</strong>
        </p>
        <p>
          Status: <strong>{data.status ?? "pending"}</strong>
        </p>
      </div>
    </section>
  );
}
