"use client"

import { useEffect } from "react"
import { format } from "date-fns"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import APButton from "../abutton"

const lecturerOptions = [
  { id: "1", name: "Dr. Sarah Johnson" },
  { id: "2", name: "Prof. Michael Chen" },
  { id: "3", name: "Dr. Amina Okafor" },
]

const formSchema = z.object({
  institution: z.string().min(1),
  address: z.string().min(1),
  deadline: z.date(),
  letterCount: z.coerce.number().min(1).max(10),
  purpose: z.string().min(1),
  extraInfo: z.string().optional(),
  lecturers: z.array(z.string()).min(1),
})

export function RecommendationForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      institution: "",
      address: "",
      deadline: new Date(),
      letterCount: 1,
      purpose: "",
      extraInfo: "",
      lecturers: [""],
    },
  })

  const letterCount = useWatch({ control: form.control, name: "letterCount" })

  useEffect(() => {
    const current = form.getValues("lecturers") || []
    const updated = [...current]
    while (updated.length < letterCount) updated.push("")
    if (updated.length > letterCount) updated.length = letterCount
    form.setValue("lecturers", updated)
  }, [form, letterCount])

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => console.log(data))}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="institution"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Institution</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea className="resize-none" rows={3} {...field} />
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
                        "pl-3 text-left font-normal",
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
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Lorem ipsum dolor sit amet consectetur.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />


        <FormField
          control={form.control}
          name="letterCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Letters</FormLabel>
              <FormControl>
                <Input type="number" min={1} max={10} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {Array.from({ length: letterCount }).map((_, i) => (
          <FormField
            key={i}
            control={form.control}
            name={`lecturers.${i}`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lecturer #{i + 1}</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a lecturer" />
                    </SelectTrigger>
                    <SelectContent>
                      {lecturerOptions.map((l) => (
                        <SelectItem key={l.id} value={l.id}>
                          {l.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <FormField
          control={form.control}
          name="purpose"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Purpose</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="job">Job Application</SelectItem>
                    <SelectItem value="scholarship">Scholarship</SelectItem>
                    <SelectItem value="admission">University Admission</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="extraInfo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Extra Information</FormLabel>
              <FormControl>
                <Textarea className="resize-none" rows={5} {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        {/* <Button type="submit">Submit</Button> */}
        <APButton />
      </form>
    </Form>
  )
}

export function RecommendationSummary() {

  return (
    // <div className="space-y-4">
    //   <h3 className="text-lg font-semibold">Summary</h3>
    //   <div>
    //     <strong>Institution: </strong>{values.institution}
    //   </div>
    //   <div>
    //     <strong>Address: </strong>{values.address}
    //   </div>
    //   <div>
    //     <strong>Deadline: </strong>{values.deadline ? format(values.deadline, 'PPP') : 'Not selected'}
    //   </div>
    //   <div>
    //     <strong>Number of Letters: </strong>{values.letterCount}
    //   </div>
    //   <div>
    //     <strong>Purpose: </strong>{values.purpose}
    //   </div>
    //   <div>
    //     <strong>Extra Information: </strong>{values.extraInfo || 'None'}
    //   </div>
    //   <div>
    //     <strong>Lecturers: </strong>
    //     <ul>
    //       {values.lecturers.map((lecturer, index) => (
    //         <li key={index}>
    //           {lecturerOptions.find((option) => option.id === lecturer)?.name || 'Not selected'}
    //         </li>
    //       ))}
    //     </ul>
    //   </div>
    // </div>
    <p>Summary WIP</p>
  );
}
