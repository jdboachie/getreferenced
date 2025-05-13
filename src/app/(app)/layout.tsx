import Breadcrumbs from "@/components/nav/breadcrumbs";
import Header from "@/components/nav/header";
import { ModeToggle } from "@/components/theme/theme-toggle";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Header />
      <div className="p-4">
        <Breadcrumbs />
        {children}
      </div>
      <ModeToggle />
    </div>
  );
}