"use client"

import { z } from "zod";
import { toast } from "sonner";
import Image from 'next/image';
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react"; // useMutation,

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
import { zodResolver } from "@hookform/resolvers/zod";
import { Id } from "@/convex/_generated/dataModel";
// import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";


const FormSchema = z.object({
  additionalInfo: z.string().optional(),
  deadline: z.coerce.number(),
  institutionAddress: z.string(),
  institutionName: z.string(),
  purpose: z.enum(["admission", "scholarship", "employment", "other"]),
  recommenderId: z.string(),
  sampleLetter: z.string().optional(),
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
      recommenderId: "",
      sampleLetter: ""
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    // const newRequestId = await createRequest({
    //   recommenderId: data.recommenderId as Id<"users">,
    //   institutionName: data.institutionName,
    //   institutionAddress: data.institutionAddress,
    //   deadline: data.deadline,
    //   purpose: data.purpose,
    //   additionalInfo: data.additionalInfo,
    //   // sampleLetter: data.sampleLetter,
    // });

    toast.success(`data submitted: ${data}`);
    // router.push(`/app/requests/${newRequestId}`)
  }


  const availableRecommenders = useQuery(api.users.getAllRecommenders)


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-full gap-8 bg-background p-4 sm:py-24 sm:px-12 rounded-xs max-w-4xl mx-auto border shadow">
          <FormField
            control={form.control}
            name="institutionName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Institution Name</FormLabel>
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
                <FormLabel>Institution Address</FormLabel>
                <FormControl>
                  <Textarea className="resize-none" placeholder="123 Street, City" {...field} required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
            name="purpose"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Purpose</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <span className="sr-only">Select purpose</span>
                      <SelectValue placeholder="Select purpose" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="admission">Admission</SelectItem>
                    <SelectItem value="scholarship">Scholarship</SelectItem>
                    <SelectItem value="employment">Employment</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
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
          <FormField
            control={form.control}
            name="sampleLetter"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sample Letter</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="application/pdf"
                    {...field}
                    className="p-4 border border-dashed grid place-items-center h-[100px]"
                  />
                </FormControl>
                <FormDescription>
                  This has not been implemented yet.
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
        <Button type="submit" className="mt-4">Submit request</Button>
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