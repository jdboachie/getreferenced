import Header from "@/components/nav/header";
// import Footer from "@/components/nav/footer";
import { RoleProvider } from "@/hooks/use-role";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RoleProvider>
      <>
        <Header />
        <div className="pb-5"> {/*min-h-[calc(100dvh-218px)]*/}
          {children}
        </div>
        {/* <Footer /> */}
      </>
    </RoleProvider>
  );
}