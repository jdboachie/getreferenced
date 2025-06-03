"use client";

import { z } from "zod";
import * as React from "react";
import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";

import { ConvexError } from "convex/values";
import { useAuthActions } from "@convex-dev/auth/react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SpinnerIcon } from "@/components/icons";
import { AnimatedState } from "@/components/motion/animated-state";


const formSchema = z.object({
  email: z.string({ required_error: "Email is required" })
    // .min(2, { message: "Email must be at least 2 characters" })
    .email({ message: "Invalid email address" }),

  password: z.string({ required_error: "Password is required" })
    .min(6, { message: "Your password must be at least 6 characters long." }),
});


export default function SignInForm() {

  const router = useRouter();
  const { signIn } = useAuthActions();

  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [error, setError] = React.useState<ConvexError<any> | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    },
  })

  const onSubmit = React.useCallback(
    (values: z.infer<typeof formSchema>) => {
      setIsSubmitting(true);
      void signIn("password", {
        email: values.email,
        password: values.password,
        flow: 'signIn',
      })
        .then(() => {
          router.push("/app/profile")
        })
        .catch((error) => {
          setError(error.message);
          setTimeout(() => setError(null), 5000);
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    },
    [router, signIn]
  );

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
              <FormDescription>

              </FormDescription>
              <FormMessage />
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
                    autoComplete={"current-password"}
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
              <FormDescription>

              </FormDescription>
              <FormMessage id="password-error" />
            </FormItem>
          )}
        />
        <Button
          size={'lg'}
          type="submit"
          disabled={isSubmitting}
          className="w-full"
        >
          <AnimatedState>
            {
              isSubmitting ?
                <div className="flex gap-2"><SpinnerIcon />Please wait</div>
                :
                <>Sign In</>
            }
          </AnimatedState>
        </Button>
      </form>
      {error && (
        <div className="mt-4 text-sm text-destructive animate-fade-in">{error.message}</div>
      )}
    </Form>
  );
}
