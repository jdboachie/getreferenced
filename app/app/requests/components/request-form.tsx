"use client"

import { z } from "zod"
import Image from 'next/image'
// import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useQuery } from "convex/react" // useMutation

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/multi-select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Skeleton } from "@/components/ui/skeleton"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { scrollTo } from "./steps"
import { DataRow } from "./data-row"


const FormSchema = z.object({
  additionalInfo: z.string().optional(),
  deadline: z.coerce.number(),
  institutionAddress: z.string(),
  institutionName: z.string(),
  recommenderIds: z.array(z.string()).min(1, "Required"),
  // sampleLetter: z.string().optional(),
})

export default function RequestForm() {

  // const router = useRouter()
  // const createRequest = useMutation(api.requests.createRequest)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      additionalInfo: "",
      institutionAddress: "",
      institutionName: "",
      recommenderIds: [],
      // sampleLetter: ""
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
      toast("You submitted the following values", {
      description: (
        <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),

    })
    // const newRequestId = await createRequest({
    //   recommenderId: data.recommenderId as Id<"users">,
    //   institutionName: data.institutionName,
    //   institutionAddress: data.institutionAddress,
    //   deadline: data.deadline,
    //   additionalInfo: data.additionalInfo,
    //   // sampleLetter: data.sampleLetter,
    // });

    // toast.success(`data submitted: ${data}`);
    // router.push(`/app/requests/${newRequestId}`)
  }

  const availableRecommenders = useQuery(api.users.getAllRecommenders)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-12 w-full">
        <div id="institution" className="p-5 pb-6 rounded-md border bg-background shadow-xs grid gap-8">
          <h2 className="text-xl font-medium">Institution details</h2>
          <FormField
            control={form.control}
            name="institutionName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Institution Name<span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="University of..." {...field} required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="institutionAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Institution Address<span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <Textarea className="resize-none" placeholder="123 Street, City" {...field} required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div id='recommenders' className="p-5 pb-6 rounded-md border bg-background shadow-xs grid gap-8">
          <h2 className="text-xl font-medium">Recommenders</h2>
          <FormField
            control={form.control}
            name="recommenderIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel></FormLabel>
                <MultiSelect onValuesChange={field.onChange} values={field.value}>
                  <FormControl>
                    <MultiSelectTrigger className="w-full">
                      <MultiSelectValue placeholder="Select recommenders..." />
                    </MultiSelectTrigger>
                  </FormControl>
                  <MultiSelectContent>
                    <MultiSelectGroup>
                      {(availableRecommenders?.length ?? 0) > 0 ?
                        <>
                          {availableRecommenders?.map((rec) => {
                            return (
                            <MultiSelectItem key={rec._id} value={rec._id}>
                              <RecommenderImage src={rec.image} />
                              {rec.firstName ? rec.firstName + ' ' + rec.lastName : "Unnamed"}
                            </MultiSelectItem>
                          )})}
                        </>
                        :
                        <p className="text-muted-foreground p-3 text-sm">No recommenders available</p>
                      }
                    </MultiSelectGroup>
                  </MultiSelectContent>
                </MultiSelect>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div id='details' className="p-5 pb-6 rounded-md border bg-background shadow-xs grid gap-8">
          <h2 className="text-xl font-medium">Details & Deadline</h2>
          <FormField
            control={form.control}
            name="deadline"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Deadline</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full h-10 pl-3 text-left font-normal bg-transparent",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={new Date(field.value)}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date()
                      }
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Kindly attach proof of this deadline in the additional information section
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="additionalInfo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Information</FormLabel>
                <FormControl>
                  <Textarea className="resize-none" placeholder="Any other notes..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div id='preview' className="p-5 pb-6 rounded-md border bg-background shadow-xs grid gap-8">
          <h2 className="text-xl font-medium">Review & Submit</h2>
          <ul className="grid gap-1">
            <DataRow name={'Institution Name'} value={form.watch('institutionName')} />
            <DataRow name={'Institution Address'} value={form.watch('institutionAddress')} />
            <DataRow
              name={'Deadline'}
              value={form.watch('deadline') ? (new Date(form.watch('deadline'))).toUTCString() : undefined}
            />
            <DataRow
              name="Recommenders"
              value={
                <div className="flex flex-col gap-2">
                  {form.watch("recommenderIds")?.length > 0 ? (
                    form.watch("recommenderIds").map((id: string) => {
                      const rec = availableRecommenders?.find(r => r._id === id)
                      return rec ? (
                        <div key={rec._id} className="flex items-center gap-2">
                          <RecommenderImage src={rec.image} />
                          <span>
                            {rec.firstName ? `${rec.firstName} ${rec.lastName}` : "Unnamed"}
                          </span>
                        </div>
                      ) : null
                    })
                  ) : (
                    <span className="text-muted-foreground text-sm">No recommenders selected</span>
                  )}
                </div>
              }
            />
            <DataRow name={'Additional Information'} value={form.watch('additionalInfo')} />
          </ul>
          <div className="flex justify-between w-full">
            <Button onClick={() => scrollTo('institution')} type='button' variant={'outline'}>Back to top</Button>
            <Button type="submit">Submit request</Button>
          </div>
        </div>
      </form>
    </Form>
  )
}

const RecommenderImage = ({src} : {src: Id<"_storage"> | string | undefined}) => {
  const imageUrl = useQuery(api.storage.getFileUrl, { src: src})

  if (imageUrl === undefined) {
    return <Skeleton className="size-5 rounded-full" />
  } else if (imageUrl === null) {
    return <div className="size-5 rounded-full bg-secondary border" />
  }
  return (
    <Image
      alt="recommender image"
      src={imageUrl}
      className="size-5 rounded-full border"
      width={500}
      height={500}
    />
  )
}