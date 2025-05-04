import { Input } from "@/components/ui/input";
import { SearchIcon } from "@/components/ui/search";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";


export default function Home() {
  return (
    <div className="grid gap-8 p-3 px-4 w-full">
      <div className="flex justify-between max-sm:grid gap-2">
        <div className="relative rounded-md bg-background h-10 w-full max-w-sm">
          <SearchIcon className="absolute bottom-3 left-3 [&_svg]:size-4 text-muted-foreground" />
          <Input className="h-10 px-10 bg-background" placeholder="Search anything..." />
          <kbd className='absolute bg-primary-foreground border size-5 grid place-items-center text-xs rounded-sm right-0 bottom-0 m-2.5'>/</kbd>
        </div>

        <div className="flex gap-2">
          <Select>
            <SelectTrigger size="lg" className="bg-background min-w-[160px]">
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

      <section className="">
      <Drawer shouldScaleBackground>
        <DrawerTrigger>
          open drawer
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="sr-only dev">
            <DrawerTitle>Are you absolutely sure?</DrawerTitle>
            <DrawerDescription>This action cannot be undone.</DrawerDescription>
          </DrawerHeader>
          <DrawerClose className="absolute right-0 top-0 m-2" asChild>
            <Button variant="outline" size={'icon'} className="rounded-full">
              <XIcon />
            </Button>
          </DrawerClose>
          <div className="p-8">Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur explicabo ullam quae provident omnis debitis laboriosam magni! Nihil necessitatibus similique hic aspernatur nulla voluptas optio voluptatum, enim ad labore sit, ipsam, adipisci impedit consequuntur a voluptates. Animi quos ea sint blanditiis nihil, quod iure temporibus, accusamus nesciunt, nemo quo adipisci?</div>
        </DrawerContent>
      </Drawer>
      </section>
    </div>
  );
}
