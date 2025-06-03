import Header from "@/components/nav/header";
import Breadcrumbs from "@/components/nav/breadcrumbs";
import Footer from "@/components/nav/footer";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Header />
      <div className="p-4 sm:p-6 pb-8">
        <Breadcrumbs />
        {children}
      </div>
      <Footer />
    </div>
  );
}