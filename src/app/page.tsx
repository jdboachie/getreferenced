'use client';

import RequestCard from "@/components/cards/request-card";
import PageTitle from "@/components/page-title";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "@/components/ui/search";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowDownUpIcon, PlusIcon } from "lucide-react";
import Link from "next/link";


export default function Home() {
  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex justify-between items-center">
        <PageTitle title='Requests' />
        {/* Should be a separate component */}
        <Link
          prefetch={true}
          href={'/requests/new'}
          className={`${buttonVariants({size: 'icon', variant: 'default'})} sm:hidden size-10 active:scale-[0.995] active:shadow-inner active:translate-y-[1px]`}
          onTouchStart={() => {
            try {
              navigator.vibrate(40)
            } catch {
              console.log('Vibration API not available')
            }
          }}
          onTouchEnd={() => {
            try {
              navigator.vibrate(15)
            } catch {
              console.log('Vibration API not available')
            }
          }}
        >
          <span className="sr-only">New</span>
          <PlusIcon />
        </Link>
      </div>
      <div className="flex sm:justify-between max-sm:flex-col gap-2">
        <div className="flex gap-1 sm:gap-2">
          <div className="z-10 relative rounded-md bg-background h-10 w-full">
            <SearchIcon className="absolute bottom-3 left-3 [&_svg]:size-4 text-muted-foreground" />
            <Input className="h-10 px-10 w-full bg-background" placeholder="Search anything..." />
            <kbd className='absolute max-md:hidden bg-primary-foreground border size-5 grid place-items-center text-xs rounded-sm right-0 bottom-0 m-2.5'>/</kbd>
          </div>
        </div>
        <div className="flex gap-2">
          <Select>
            <SelectTrigger size="lg" className="w-full sm:min-w-[160px]">
              <ArrowDownUpIcon /><SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Due date</SelectItem>
              <SelectItem value="dark">Updated</SelectItem>
              <SelectItem value="system">Status</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger size="lg" className="w-full sm:min-w-[160px]">
              <SelectValue placeholder="Group by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">School</SelectItem>
              <SelectItem value="dark">Purpose</SelectItem>
              <SelectItem value="system">Recommender</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <section className="grid h-fit gap-4">
        <RequestCard />
        <RequestCard />
        <RequestCard />
        <RequestCard />
        <RequestCard />
        <RequestCard />
        <RequestCard />
        <RequestCard />
      </section>
    </div>
  );
}
