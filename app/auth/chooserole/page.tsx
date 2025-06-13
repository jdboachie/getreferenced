"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { api } from "@/convex/_generated/api"
import { useMutation, useQuery } from "convex/react"

const FormSchema = z.object({
  role: z.enum(["requester", "recommender"], {
    required_error: "Please select a role.",
  }),
})

export default function Page() {
  const router = useRouter()

  const user = useQuery(api.users.getCurrentUser)!
  const createProfile = useMutation(api.users.createProfile)
  const updateUser = useMutation(api.users.updateUser)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      role: "requester",
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    await createProfile({ role: data.role })
    await updateUser({ userId: user._id, role: data.role }).then(() => {
      router.push("/app/account")
    })
  }

  return (
    <div className="w-full p-4">
      <h1 className="text-2xl font-medium mb-1">Choose Your Role</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full grid">
          <p className="text-sm text-muted-foreground">
            Select your role to continue registration
          </p>
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="grid sm:grid-cols-2 gap-2"
                  >
                    <FormItem data-checked={field.value==="requester"} className="data-[checked=true]:border-primary relative border rounded-lg space-x-3 space-y-0">
                      <FormControl className="absolute top-4 left-4">
                        <RadioGroupItem value="requester"/>
                      </FormControl>
                      <FormLabel className="font-normal grid p-4 gap-3">
                        <p className="ml-6">Requester</p>
                        <p className="text-xs text-muted-foreground">Students, grads, jobseekers</p>
                      </FormLabel>
                    </FormItem>
                    <FormItem data-checked={field.value==="recommender"} className="data-[checked=true]:border-primary relative border rounded-lg space-x-3 space-y-0">
                      <FormControl className="absolute top-4 left-4">
                        <RadioGroupItem value="recommender"/>
                      </FormControl>
                      <FormLabel className="font-normal grid p-4 gap-3">
                        <p className="ml-6">Recommender</p>
                        <p className="text-xs text-muted-foreground">Lecturers, employers, staff</p>
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" size="lg">
            Continue
          </Button>
        </form>
      </Form>
    </div>
  )
}
