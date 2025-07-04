import { Sidenav } from "@/components/nav/sidenav";
import TitleBlock from "@/components/nav/title-block";
// import TitleActions from "./components/title-actions";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <TitleBlock
        title="Account"
      >
        {/* <TitleActions /> */}
      </TitleBlock>
      <div className="max-[1170px]:px-5 pb-16 max-w-6xl w-full mx-auto">
        <div className="flex max-md:flex-col gap-12 w-full">
          <Sidenav
            links={[
              {
                href: "/app/account",
                label: "Profile",
              },
              {
                href: "/app/account/files",
                label: "Files",
              },
              // {
              //   href: "/app/account/billing",
              //   label: "Billing",
              // },
            ]}
          />
          <div className="flex flex-col gap-12 size-full">
            {children}
          </div>
        </div>
      </div>
    </>
  )
}
