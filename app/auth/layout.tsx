export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="max-w-lg mx-auto min-h-dvh grid place-items-center p-3 sm:p-6">
      {children}
    </div>
  );
}