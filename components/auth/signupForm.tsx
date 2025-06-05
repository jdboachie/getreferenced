"use client";

import * as React from "react";
import { useRouter } from 'next/navigation';

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// import { useMutation, useQuery } from "convex/react";
// import { api } from "@/convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SpinnerIcon } from "@/components/icons";
import { AnimatedState } from "@/components/motion/animated-state";


const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Your password must be at least 6 characters long." }),
  confirmPassword: z.string(),
  role: z.enum(["requester", "recommender"], {
    required_error: "Please select a role",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});


export default function SignUpForm() {

  const router = useRouter()
  // const searchParams = useSearchParams();
  // const verify = searchParams.get('verify');

  const { signIn } = useAuthActions();

  const [error, setError] = React.useState<string | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [status, setStatus] = React.useState<'submitting' | 'creating' | 'success' | null>()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      role: undefined,
    },
  });

  const onSubmit = React.useCallback(async (values: z.infer<typeof formSchema>) => {
    try {
      setStatus('submitting');
      await signIn("password", {
        email: values.email,
        password: values.password,
        role: values.role,
        flow: 'signUp',
        // redirectTo: `/auth/verify?email=${values.email}`
      });
      router.push(`/auth/verify?email=${values.email}&role=${values.role}`)
    } catch (error) {
      setError((error as Error).message);
      setTimeout(() => setError(null), 5000);
    } finally {
      setStatus(null);
    }
  }, [router, signIn]);


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input required placeholder="you@example.edu" {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription>This will be your primary email address</FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    {...field}
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    aria-invalid={!!form.formState.errors.password}
                    aria-describedby="password-error"
                    />
                </FormControl>
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <FormDescription>Your password should have a minimum of 6 characters</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    {...field}
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                  />
                </FormControl>
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  tabIndex={-1}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
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
        <Button type="submit" size="lg" disabled={status === 'creating' || status === 'submitting'} className="w-full">
          <AnimatedState>
            {status === 'submitting' && <div className="flex gap-1.5 items-center"><SpinnerIcon /> Submitting...</div>}
            {status === 'creating' && <div className="flex gap-1.5 items-center"><SpinnerIcon /> Creating profile...</div>}
            {!status && 'Submit'}
          </AnimatedState>
        </Button>
      </form>
      {error && (
        <div className="mt-4 text-sm text-destructive animate-fade-in">{error}</div>
      )}
    </Form>
  );
}
