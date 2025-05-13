'use client';

import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useAuthActions } from '@convex-dev/auth/react'
import { useConvexAuth } from 'convex/react'
import { ArrowDownUpIcon, LayoutGridIcon, ListIcon, Rows3Icon, SearchIcon } from 'lucide-react'
import Link from 'next/link';
import { useRouter } from 'next/navigation'


function Page() {
  return (
    <div>
      <div className="flex md:justify-between max-md:flex-col gap-2">
        <div className="w-full flex gap-2">
          <div className="z-10 relative rounded-md bg-surface h-10 w-full">
            <SearchIcon className="absolute bottom-3 left-3 size-4 text-muted-foreground" />
            <Input className="h-10 px-10 w-full" placeholder="Search anything..." />
            <kbd className='absolute max-md:hidden dark:bg-primary-foreground border size-5 grid place-items-center text-xs rounded-sm right-0 bottom-0 m-2.5'>/</kbd>
          </div>
          <ToggleGroup type="single" size={'sm'} className="border px-1 bg-surface">
            <ToggleGroupItem defaultChecked value="list"><ListIcon /></ToggleGroupItem>
            <ToggleGroupItem value="grid"><LayoutGridIcon /></ToggleGroupItem>
          </ToggleGroup>
        </div>
        <div className="gap-2 grid grid-cols-2 md:flex">
          <Select>
            <SelectTrigger className="h-10 bg-surface w-full md:min-w-[180px] md:w-[180px]">
              <ArrowDownUpIcon /><SelectValue className="truncate" placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="deadline">Sort by deadline</SelectItem>
              <SelectItem value="updated">Sort by updated</SelectItem>
              <SelectItem value="status">Sort by status</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="h-10 bg-surface w-full md:min-w-[180px] md:w-[180px]">
              <Rows3Icon />
              <SelectValue placeholder="Group by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Institution</SelectItem>
              <SelectItem value="dark">Purpose</SelectItem>
              <SelectItem value="system">Recommender</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className='mt-6 border'>
        <Link prefetch href="/app/requests/new">new</Link>
        <SignOutButton />
      </div>
    </div>
  )
}

export default Page

function SignOutButton() {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();
  const router = useRouter();
  return (
    <>
      {isAuthenticated && (
        <button
          className="bg-slate-200 dark:bg-slate-800 text-foreground rounded-md px-2 py-1"
          onClick={() =>
            void signOut().then(() => {
              router.push("/signin");
            })
          }
        >
          Sign out
        </button>
      )}
    </>
  );
}