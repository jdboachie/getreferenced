import Header from "@/components/nav/header";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Header />
      <div className="p-4 max-w-screen-2xl">
        {children}
      </div>
    </div>
  );
}