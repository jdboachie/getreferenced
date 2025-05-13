import Header from "@/components/nav/header";
import Breadcrumbs from "@/components/nav/breadcrumbs";

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
    </div>
  );
}