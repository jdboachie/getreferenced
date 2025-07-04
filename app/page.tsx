import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

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
      <div className="size-full border bg-background p-5 rounded-md">
        <h1>The quick brown fox jumped over the lazy dog.</h1>
        <h2>The quick brown fox jumped over the lazy dog.</h2>
        <h3>The quick brown fox jumped over the lazy dog.</h3>
      </div>
    </div>
  );
}


