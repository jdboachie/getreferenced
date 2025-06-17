import Header from "@/components/nav/header";
import Breadcrumbs from "@/components/nav/breadcrumbs";
import Footer from "@/components/nav/footer";
import { RoleProvider } from "@/hooks/use-role";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RoleProvider>
      <div>
        <Header />
        <div className="max-xl:px-5 pb-16 max-w-6xl mx-auto min-h-[calc(100dvh-218px)]">
          <Breadcrumbs />
          {children}
        </div>
        <Footer />
      </div>
    </RoleProvider>
  );
}