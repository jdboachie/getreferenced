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
      <div className="max-[1170px]:px-5 max-w-6xl size-full mx-auto">
        {children}
      </div>
    </>
  );
}