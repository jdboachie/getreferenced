import Header from "@/components/nav/header";
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
        <div className="pb-10">
          {children}
        </div>
      </>
    </RoleProvider>
  );
}