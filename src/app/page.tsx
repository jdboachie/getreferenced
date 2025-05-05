import { Input } from "@/components/ui/input";
import { SearchIcon } from "@/components/ui/search";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


export default function Home() {
  return (
    <div className="grid gap-8 p-3 px-4 w-full">
      <div className="flex sm:justify-between max-sm:flex-col gap-2">
        <div className="z-10 relative rounded-md bg-background h-10 w-full">
          <SearchIcon className="absolute bottom-3 left-3 [&_svg]:size-4 text-muted-foreground" />
          <Input className="h-10 px-10 w-full" placeholder="Search anything..." />
          <kbd className='absolute bg-primary-foreground border size-5 grid place-items-center text-xs rounded-sm right-0 bottom-0 m-2.5'>/</kbd>
        </div>

        <div className="flex gap-2 z-10">
          <Select>
            <SelectTrigger size="lg" className=" min-w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Due date</SelectItem>
              <SelectItem value="dark">Updated</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <section className="dev">

      </section>
    </div>
  );
}
