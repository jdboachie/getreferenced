export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid sm:py-24 place-items-center h-screen bg-gradient-to-b from-blue-500/5 via-violet-500/5 dark:via-violet-500/4 to-purple-500/5 dark:to-purple-500/4">
      <div className="sm:rounded-lg border md:shadow-md md:dark:shadow-2xl p-5 sm:p-6 bg-background/70 dark:bg-background/90 min-h-[500px] max-w-md w-full">
        {children}
      </div>
    </div>
  );
}