export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-w-screen min-h-[100dvh] flex place-items-center p-6 md:p-0">
      {children}
    </div>
  );
}