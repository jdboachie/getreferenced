'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useRole } from '@/hooks/use-role';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { Button, buttonVariants } from '@/components/ui/button';
import { ArrowLeftIcon, SearchIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';


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
    <section className="space-y-6 mt-6">
      <div className="flex justify-between">
        <div className='max-w-sm w-full relative bg-background rounded-md'>
          <Input className='w-full px-10' placeholder='Search requests...' />
          <SearchIcon className='absolute inset-3 size-4 text-muted-foreground' />
        </div>
        {role === "requester" && (
          <Link
            className={buttonVariants({ size: "lg", variant: "default" })}
            prefetch
            href="/app/requests/new"
          >
            New request
          </Link>
        )}
      </div>

      {isLoading && <p className="text-muted-foreground">Loading...</p>}

      {!isLoading && requests?.length === 0 && (
        <p className="text-muted-foreground text-sm">No requests found.</p>
      )}

      <ul className="space-y-4">
        {requests?.map((req) => (
          <li
            key={req._id}
            className="border bg-background rounded-lg p-4 hover:bg-background/80 transition"
          >
            <Link href={`/app/requests?id=${req._id}`} className="block space-y-1">
              <p className="font-medium">{req.institutionName}</p>
              <p className="text-sm text-muted-foreground">
                Due: {new Date(req.deadline).toLocaleDateString()}
              </p>
              <p className="text-sm">Purpose: {req.purpose ?? "—"}</p>
              <p className="text-sm">Status: {req.status ?? "pending"}</p>
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
            <Link className={buttonVariants({ size: 'lg', variant: 'default'})} prefetch href="/app/requests/new">New request</Link>
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
