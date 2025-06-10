"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon } from "lucide-react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"


const FormSchema = z.object({
  additionalInfo: z.string().optional(),
  deadline: z.coerce.number(),
  institutionAddress: z.string(),
  institutionName: z.string(),
  purpose: z.enum(["admission", "scholarship", "employment", "other"]).optional(),
  recommenderId: z.string(),
  sampleLetter: z.string().optional(),
})

export default function RequestForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      additionalInfo: "",
      institutionAddress: "",
      institutionName: "",
      recommenderId: "",
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast("Submitted values", {
      description: (
        <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  const availableRecommenders = useQuery(api.users.getAllRecommenders)

  return (
    <div className="flex max-lg:flex-col w-full gap-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 grid grow">
          <Badge variant={'destructive'}>Work in progress</Badge>
          <FormField
            control={form.control}
            name="institutionName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Institution Name</FormLabel>
                <FormControl>
                  <Input placeholder="University of..." {...field} />
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
                  <Input placeholder="123 Street, City" {...field} />
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
                          "w-[240px] pl-3 text-left font-normal",
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
                    <SelectTrigger>
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
          <FormField
            control={form.control}
            name="recommenderId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recommender</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a recommender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {(availableRecommenders?.length ?? 0) > 0 ?
                    <>
                      {availableRecommenders?.map((rec) => (
                        <SelectItem key={rec._id} value={rec._id}>
                          {rec.staffNumber ?? rec.primaryEmail ?? "Unnamed"}
                        </SelectItem>
                      ))}
                    </>
                    :
                    <p className="text-muted-foreground p-4 text-sm">No recommenders available</p>
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
                <FormLabel>Sample Letter File ID</FormLabel>
                <FormControl>
                  <Input placeholder="file_abc123" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
      <div className="w-full lg:w-[350px] h-fit flex lg:flex-col gap-2 lg:sticky lg:top-38 bg-background p-4 rounded-lg border shadow-xs">
        <h3 className="font-medium text-lg">Summary</h3>
      </div>
    </div>
  )
}
