"use client"

import { z } from "zod";
import Image from 'next/image';
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import { zodResolver } from "@hookform/resolvers/zod";
import { Id } from "@/convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { scrollTo } from "./steps";
import { DataRow } from "./data-row";


const FormSchema = z.object({
  additionalInfo: z.string().optional(),
  deadline: z.coerce.number(),
  institutionAddress: z.string(),
  institutionName: z.string(),
  recommenderId: z.string(),
  // sampleLetter: z.string().optional(),
})

export default function RequestForm() {

  const router = useRouter()
  const createRequest = useMutation(api.requests.createRequest)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      additionalInfo: "",
      institutionAddress: "",
      institutionName: "",
      recommenderId: "",
      // sampleLetter: ""
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const newRequestId = await createRequest({
      recommenderId: data.recommenderId as Id<"users">,
      institutionName: data.institutionName,
      institutionAddress: data.institutionAddress,
      deadline: data.deadline,
      additionalInfo: data.additionalInfo,
      // sampleLetter: data.sampleLetter,
    });

    toast.success(`data submitted: ${data}`);
    router.push(`/app/requests/${newRequestId}`)
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
            name="recommenderId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recommender</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <span className="sr-only">Select recommender</span>
                      <SelectValue placeholder="Select recommender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {(availableRecommenders?.length ?? 0) > 0 ?
                    <>
                      {availableRecommenders?.map((rec) => {

                        return (
                        <SelectItem key={rec._id} value={rec._id}>
                          <RecommenderImage src={rec.image} />
                          {rec.firstName ? rec.firstName + ' ' + rec.lastName : "Unnamed"}
                        </SelectItem>
                      )})}
                    </>
                    :
                    <p className="text-muted-foreground p-3 text-sm">No recommenders available</p>
                    }
                  </SelectContent>
                </Select>
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
          <ul className="">
            <DataRow name={'Institution Name'} value={form.watch('institutionName')} />
            <DataRow name={'Institution Address'} value={form.watch('institutionAddress')} />
            <DataRow
              name={'Deadline'}
              value={form.watch('deadline') ? (new Date(form.watch('deadline'))).toUTCString() : undefined}
            />
            <DataRow
              name={'Recommenders'}
              value={
                availableRecommenders?.find(r => r._id === form.watch("recommenderId"))?.firstName
                ? availableRecommenders.find(r => r._id === form.watch("recommenderId"))?.firstName + " " +
                availableRecommenders.find(r => r._id === form.watch("recommenderId"))?.lastName
                : undefined
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
  return (
    <>
      {imageUrl ?
        <Image
          alt="recommender image"
          src={imageUrl}
          className="size-5 rounded-full border"
          width={500}
          height={500}
        />
        :
        <Skeleton className="size-5 rounded-full" />
      }
    </>
  )
}