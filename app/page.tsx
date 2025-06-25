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
    </div>
  );
}


