import { Sidenav } from "./components/sidenav";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex max-lg:flex-col gap-8">
      <Sidenav />
      <div className="flex flex-col gap-8 w-full">
        {children}
      </div>
    </div>
  )
}
