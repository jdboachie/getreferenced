import TitleBlock from "@/components/nav/title-block";
import TitleActions from "./components/title-actions";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <TitleBlock
        title="Requests"
      >
        <TitleActions />
      </TitleBlock>
      <div className="max-xl:px-5 pb-16 max-w-6xl size-full mx-auto min-h-[calc(100dvh-218px)]">
        {children}
      </div>
    </>
  );
}