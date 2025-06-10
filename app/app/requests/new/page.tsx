"use client"

import { z } from "zod";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { useForm } from "react-hook-form";
import { api } from "@/convex/_generated/api";

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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex max-lg:flex-col w-full gap-8">
        <div className="space-y-8 grid grow">
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
                          "w-full pl-3 text-left font-normal",
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
                    <SelectTrigger className="w-full">
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
        </div>
        <div className="w-full lg:w-[450px] h-fit flex flex-col gap-4 lg:sticky lg:top-38 bg-background p-4 rounded-lg border shadow-xs">
          <h3 className="font-medium text-lg">Summary</h3>
          <ul className="space-y-3">
            <li className="grid text-sm"><span className="text-muted-foreground">Institution:</span> {form.watch("institutionName") || "—"}</li>
            <li className="grid text-sm"><span className="text-muted-foreground">Address:</span> {form.watch("institutionAddress") || "—"}</li>
            <li className="grid text-sm"><span className="text-muted-foreground">Deadline:</span> {form.watch("deadline") ? format(form.watch("deadline"), "PPP") : "—"}</li>
            <li className="grid text-sm"><span className="text-muted-foreground">Purpose:</span> {form.watch("purpose") || "—"}</li>
            <li className="grid text-sm"><span className="text-muted-foreground">Recommender ID:</span> {form.watch("recommenderId") || "—"}</li>
            <li className="grid text-sm"><span className="text-muted-foreground">Additional Info:</span> {form.watch("additionalInfo") || "—"}</li>
            <li className="grid text-sm"><span className="text-muted-foreground">Sample Letter File:</span> {form.watch("sampleLetter") || "—"}</li>
          </ul>
          <Button type="submit" className="mt-4">Submit request</Button>
        </div>
      </form>
    </Form>
  )
}
