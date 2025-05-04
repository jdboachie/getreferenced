// import { ModeToggle } from "@/components/theme/theme-toggle";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "@/components/ui/search";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


export default function Home() {
  return (
    <div className="grid gap-8 w-full sm:p-16 p-4 max-w-4xl ml-auto">
      <div className="flex max-sm:grid gap-2">
        <div className="relative rounded-md bg-background h-10 w-full">
          <SearchIcon className="absolute bottom-3 left-3 [&_svg]:size-4 text-muted-foreground" />
          <Input className="h-10 px-10 bg-background" placeholder="Search anything..." />
          <kbd className='absolute bg-primary-foreground border size-5 grid place-items-center text-xs rounded-sm right-0 bottom-0 m-2.5'>/</kbd>
        </div>

        <Select>
          <SelectTrigger size="lg" className="bg-background min-w-[160px]">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <section className="">

      </section>
    </div>
  );
}
