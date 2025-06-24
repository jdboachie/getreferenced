import Link from "next/link";
import { buttonVariants, Button } from "@/components/ui/button";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import ThemeToggle from "@/components/theme/theme-toggle";

export default function Home() {
  return (
    <div className="flex flex-col items-center p-6 sm:p-24 gap-24">
      <Link
        prefetch
        href="/app"
        className={buttonVariants({ size: 'lg'})}
      >
        Go to application
      </Link>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button>Launch modal</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Review your information</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account
              and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel autoFocus={false}>Cancel</AlertDialogCancel>
            <AlertDialogAction autoFocus>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <ThemeToggle />
    </div>
  );
}


