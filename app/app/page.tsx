import TitleBlock from "@/components/nav/title-block";

export default function Page() {
  return (
    <>
      <TitleBlock
        title="Overview"
      />
      <div className="max-lg:px-5 pb-16 max-w-6xl size-full mx-auto min-h-[calc(100dvh-435px)]">
        What should go here?<br />
        1. the top 5 requests the user has made<br />
        2. recent notifications<br />
        3. upcoming deadlines<br />
        4.
      </div>
    </>
  );
}