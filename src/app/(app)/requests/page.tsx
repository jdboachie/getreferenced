import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { ArrowDownUpIcon, LayoutGridIcon, ListIcon, Rows3Icon, SearchIcon } from 'lucide-react'


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
      <div className='mt-6'>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam neque at et recusandae voluptatum quibusdam optio sit delectus, tenetur iste? Facilis, nisi pariatur. Exercitationem eaque beatae sunt blanditiis nulla quibusdam possimus impedit magni delectus aut mollitia dicta nobis, iste numquam officia dolorum facere soluta dolore quas! Voluptate minima dolorem iste eligendi? Mollitia aliquam, doloribus consectetur, reprehenderit voluptas, eveniet cum officia velit enim accusamus unde provident facere culpa adipisci sed illo ipsam maiores. Optio, eligendi. Ducimus nulla quia dolore impedit cumque quasi accusantium culpa non consequuntur? Quia minima eligendi molestiae alias, deserunt voluptate corrupti natus ducimus? Sit corrupti, modi sapiente deleniti minima accusantium maiores et! Tenetur delectus fuga ullam quisquam id nam consequuntur porro doloremque animi, itaque, laboriosam accusamus ad! Debitis perspiciatis quia neque, a nisi aspernatur molestiae eaque laboriosam qui cupiditate minima id asperiores inventore nihil, culpa obcaecati dolor repellendus velit eveniet quibusdam quas natus alias ab. Officiis at quaerat ullam facere aspernatur debitis praesentium, eum voluptas nam corporis doloremque nemo distinctio molestias saepe nulla magni iure repellat sapiente! Soluta officiis, dolores facilis natus repellat magnam assumenda vitae beatae itaque doloribus rerum vero deserunt dolorum sit odio totam ratione perferendis voluptatibus distinctio! Cumque inventore laborum asperiores rerum commodi incidunt qui dolorem. Pariatur, cum? Accusantium deserunt mollitia dolor, neque excepturi esse veritatis nulla est doloribus. Iusto expedita quis quasi laboriosam, iste inventore consectetur mollitia esse quam blanditiis placeat alias pariatur ut obcaecati sequi voluptatum exercitationem. Culpa explicabo numquam fuga exercitationem sint nam deleniti quidem est, illum error fugit itaque eum minima expedita dolorum, esse rerum aspernatur ratione nostrum praesentium in quaerat. Ea suscipit nemo eum repellat ipsam consequatur id dolorum praesentium quos labore, eos ab libero deleniti qui magni commodi laborum? Aliquam, ducimus laborum optio qui cumque debitis itaque nesciunt libero quas, ipsum maxime dignissimos, dolore voluptas! Commodi maiores dolores animi.
      </div>
    </div>
  )
}

export default Page