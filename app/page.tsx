'use client';

import Step from "@/components/multistep-step";

// import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center p-6 sm:p-24 gap-24">
      {/* <Link
        prefetch
        href="/app"
        className="w-fit inline-flex justify-center bg-blue-500 items-center text-primary-foreground rounded-full px-4 py-2 font-medium text-sm"
      >
        Go to application
      </Link> */}
      <Step step={1} />
    </div>
  );
}


