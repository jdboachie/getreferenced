"use client"

import { z } from "zod"
import Image from 'next/image'
import { cn } from "@/lib/utils"
import { useState } from "react"
import { format } from "date-fns"
import { useQuery, useMutation } from "convex/react"
import { useForm } from "react-hook-form"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"

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
import { CalendarIcon, CheckCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Skeleton } from "@/components/ui/skeleton"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { scrollTo } from "./steps"
import { DataRow } from "./data-row"
import PersonalDetailsCard from "./personal-details-card"
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react"
import { useRouter } from "next/navigation"

const FormSchema = z.object({
  additionalInfo: z.string().optional(),
  deadline: z.coerce.number({
    required_error: "A deadline is required.",
  }),
  institutionAddress: z.string().min(1, "Institution Address is required"),
  institutionName: z.string().min(1, "Institution Name is required"),
  recommenderIds: z.array(z.string()).min(1, "Please select at least one recommender"),
})

interface FormTextFieldProps {
  control: ReturnType<typeof useForm<z.infer<typeof FormSchema>>>['control'];
  name: keyof z.infer<typeof FormSchema>; // Use keyof for type safety
  label: string;
  placeholder: string;
  required?: boolean;
  textarea?: boolean;
}

const FormTextField = ({
  control,
  name,
  label,
  placeholder,
  required = false,
  textarea = false,
}: FormTextFieldProps) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>
          {label}
          {required && <span className="text-destructive">*</span>}
        </FormLabel>
        <FormControl>
          {textarea ? (
            <Textarea className="resize-none" placeholder={placeholder} {...field} required={required} />
          ) : (
            <Input placeholder={placeholder} {...field} required={required} />
          )}
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
)

export default function RequestForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const createReqeust = useMutation(api.requests.createRequest);
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      additionalInfo: "",
      institutionAddress: "",
      institutionName: "",
      recommenderIds: [],
      deadline: undefined,
    },
  })

  const handleNext = async () => {
    let isValid = false;

    // Validate current step's fields
    if (currentStep === 0) {
      isValid = true // Personal Details card has no form fields to validate within RequestForm
    } else if (currentStep === 1) {
      isValid = await form.trigger(["institutionName", "institutionAddress"]);
    } else if (currentStep === 2) {
      isValid = await form.trigger(["recommenderIds"]);
    } else if (currentStep === 3) {
      isValid = await form.trigger(["deadline"]);
    }

    if (isValid) {
      setCurrentStep((prev) => prev + 1);
      scrollTo('top-of-form'); // Optional: Scroll to the top of the form on step change
    } else {
      toast.error("Please fill in all required fields for this step.");
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
    scrollTo('top-of-form'); // Optional: Scroll to the top of the form on step change
  };

  async function onSubmit(data: z.infer<typeof FormSchema>) {

    const { recommenderIds, ...common } = data

    try {
      await Promise.all(
        recommenderIds.map(async (recommenderId) => {
          await createReqeust({
            ...common,
            recommenderId: recommenderId as Id<"users">,
          });
        })
      );
      toast.success("Requests submitted successfully!");
      router.push('/app/requests')
    } catch (error: unknown) {
      console.log(error)
      toast.error("Failed to submit requests. Please try again.");
    }
  }

  const availableRecommenders = useQuery(api.users.getAllRecommenders)

  const steps = [
    {
      id: 'profile',
      title: 'Profile',
      component: <PersonalDetailsCard />,
    },
    {
      id: 'institution',
      title: 'Institution details',
      component: (
        <div key="institution-details-step" className="p-5 rounded-md border bg-background shadow-xs grid gap-8">
          <h3>Institution details</h3>
          <FormTextField
            control={form.control}
            name="institutionName"
            label="Institution Name"
            placeholder="University of..."
            required
          />
          <FormTextField
            control={form.control}
            name="institutionAddress"
            label="Institution Address"
            placeholder="123 Street, City"
            required
            textarea
          />
        </div>
      )
    },
    {
      id: 'recommenders',
      title: 'Recommender(s)',
      component: (
        <div key="recommenders-step" className="p-5 rounded-md border bg-background shadow-xs grid gap-8">
          <h3>Recommenders</h3>
          <FormField
            control={form.control}
            name="recommenderIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Recommenders</FormLabel>
                <MultiSelect onValuesChange={(values) => {
                  // This is a workaround for the MultiSelect component not directly passing string[]
                  // Assuming the values array contains strings like "FirstName LastName-ID"
                  const idsOnly = values.map(val => val.split('-').pop() as Id<"users">);
                  field.onChange(idsOnly);
                }} values={field.value.map(id => {
                  const rec = availableRecommenders?.find(r => r._id === id);
                  return rec ? `${rec.firstName} ${rec.lastName}-${rec._id}` : id;
                })}>
                  <FormControl>
                    <MultiSelectTrigger className="w-full">
                      <MultiSelectValue placeholder="Select recommenders..." />
                    </MultiSelectTrigger>
                  </FormControl>
                  <MultiSelectContent>
                    <MultiSelectGroup>
                      {(availableRecommenders?.length ?? 0) > 0 ? (
                        availableRecommenders?.map((rec) => (
                          <MultiSelectItem key={rec._id} value={`${rec.firstName} ${rec.lastName}-${rec._id}`}>
                            <RecommenderImage src={rec.image} />
                            {rec.firstName ? rec.firstName + ' ' + rec.lastName : "Unnamed"}
                          </MultiSelectItem>
                        ))
                      ) : (
                        <p className="text-muted-foreground p-3 text-sm">No recommenders available</p>
                      )}
                    </MultiSelectGroup>
                  </MultiSelectContent>
                </MultiSelect>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )
    },
    {
      id: 'details',
      title: 'Details & Deadline',
      component: (
        <div key="details-deadline-step" className="p-5 rounded-md border bg-background shadow-xs grid gap-8">
          <h3>Details & Deadline</h3>
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
                          format(new Date(field.value), "PPP")
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
                      selected={typeof field.value === 'number' && !isNaN(field.value) ? new Date(field.value) : undefined}
                      onSelect={(date) => field.onChange(date ? date.getTime() : undefined)} // Store timestamp
                      disabled={(date) => date < new Date()}
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
          <FormTextField
            control={form.control}
            name="additionalInfo"
            label="Additional Information"
            placeholder="Any other notes..."
            textarea
          />
        </div>
      ),
    },
    {
      id: 'preview',
      title: 'Review & Submit',
      component: (
        <div key="preview-step" className="p-5 rounded-md border bg-background shadow-xs grid gap-8">
          <h3>Review & Submit</h3>
          <ul className="grid gap-1 max-sm:gap-2">
            <DataRow name={'Institution Name'} value={form.watch('institutionName')} />
            <DataRow name={'Institution Address'} value={form.watch('institutionAddress')} />
            <DataRow
              name={'Deadline'}
              value={
                form.watch('deadline') && typeof form.watch('deadline') === 'number' && !isNaN(form.watch('deadline'))
                  ? (new Date(form.watch('deadline'))).toUTCString()
                  : undefined
              }
            />
            <DataRow
              name="Recommenders"
              value={
                <div className="flex flex-col gap-2">
                  {form.watch("recommenderIds")?.length > 0 ? (
                    form.watch("recommenderIds").map((id: string) => {
                      const rec = availableRecommenders?.find(r => r._id === id);
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
                    <span className="text-muted-foreground text-sm">empty</span>
                  )}
                </div>
              }
            />
            <DataRow name={'Additional Information'} value={form.watch('additionalInfo')} />
          </ul>
        </div>
      ),
    },
  ];

  return (
    <div className="flex max-md:flex-col gap-12 w-full relative">
      <aside className="w-52 max-md:w-full md:sticky top-38 h-fit">
        <nav>
          <ol className="space-y-2">
            {steps.map((step, index) => (
              <li
                key={step.id}
                className={cn(
                  "flex items-center gap-3 cursor-pointer p-2 rounded-md transition-colors",
                  {
                    "text-foreground font-medium": index === currentStep, // Active step
                    "text-muted-foreground hover:bg-accent hover:text-accent-foreground": index > currentStep, // Future steps
                    "text-green-600 dark:text-green-400 hover:bg-accent hover:text-accent-foreground": index < currentStep || currentStep === 4, // Completed steps
                  }
                )}
                // Allow navigation only to previous or current steps
                onClick={async () => {
                  if (index -1 <= currentStep) {
                    let isValid = true;

                    if (currentStep === 0) {
                      isValid = true
                    } else if (currentStep === 1) {
                      isValid = await form.trigger(["institutionName", "institutionAddress"]);
                    } else if (currentStep === 2) {
                      isValid = await form.trigger(["recommenderIds"]);
                    } else if (currentStep === 3) {
                      isValid = await form.trigger(["deadline"]);
                    }
                    if (isValid) {
                      setCurrentStep(index);
                      scrollTo('top-of-form');
                    }
                  }
                }}
              >
                {index < currentStep || currentStep === 4 ? (
                  <CheckCircle className="size-4" /> // Tick icon for completed steps
                ) : (
                  <div
                    className={cn("size-4 flex text-xs items-center justify-center rounded-full border", {
                      "border-foreground text-foreground": index === currentStep, // Active step indicator
                      "border-muted-foreground text-muted-foreground": index < currentStep || currentStep === 4, // Future step indicator
                    })}
                  >
                    {index + 1}
                  </div>
                )}
                <span className="text-sm">{step.title}</span>
              </li>
            ))}
          </ol>
        </nav>
      </aside>

      {/* Main Form Content */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-12 w-full flex-1" id="top-of-form">
          {/* Render the current step's component */}
          {steps[currentStep].component}

          <div className="flex justify-between w-full">
            {currentStep > 0 && (
              <Button type='button' variant={'outline'} onClick={handleBack}><CaretLeftIcon weight="bold" /> Back</Button>
            )}

            {currentStep < steps.length - 1 && (
              <Button type='button' onClick={handleNext} className="ml-auto">Next <CaretRightIcon weight="bold" /></Button>
            )}

            {currentStep === steps.length - 1 && (
              <Button type="submit" className="ml-auto">Submit request</Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  )
}

const RecommenderImage = ({ src }: { src: Id<"_storage"> | string | undefined }) => {
  const imageUrl = useQuery(api.storage.getFileUrl, { src: src })

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