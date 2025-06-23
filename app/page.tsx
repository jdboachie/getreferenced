'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

export default function Home() {
  return (
    <div className="flex flex-col p-6 sm:p-24 gap-24">
      <div className="flex flex-col gap-4 w-fit">
        <Link
          prefetch
          href="/app"
          className="w-fit inline-flex justify-center bg-blue-500 items-center text-primary-foreground rounded-full px-4 py-2 font-medium text-sm"
        >
          Go to application
        </Link>
      <Button
        onClick={() => {
          toast('This is a success message')
        }}
      >
        Toast
      </Button>
      </div>
    </div>
  );
}
