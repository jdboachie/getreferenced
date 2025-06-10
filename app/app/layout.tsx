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
        <div className="p-4 sm:p-6 pb-8 max-w-7xl mx-auto">
          <Breadcrumbs />
          {children}
        </div>
        <Footer />
      </div>
    </RoleProvider>
  );
}