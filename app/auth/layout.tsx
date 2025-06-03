export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-w-screen min-h-dvh grid place-items-center sm:p-6">
      {children}
    </div>
  );
}