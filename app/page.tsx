import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-5xl font-bold">Landing Page</h1>
      <Link
        prefetch
        href="/app"
        className="bg-blue-500 text-white rounded-full px-4 py-2 font-medium text-sm"
      >
        Go to application
      </Link>
    </div>
  );
}
