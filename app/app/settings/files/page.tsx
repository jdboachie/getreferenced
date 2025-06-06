import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="flex flex-col gap-12">
      <div
        className="border bg-primary-foreground dark:bg-background rounded-lg"
      >
        <div className="bg-background rounded-t-lg p-4 gap-4 flex flex-col">
          <h3 className="font-medium text-lg">CV</h3>
          <p className="text-sm">
            Your Curriculum Vitae gives recommenders a sense of your academic and professional background, and helps them write a more personalized letter.
          </p>
          <div className="h-56 rounded-md bg-ground"></div>
        </div>
        <div className="md:gap-2 gap-4 flex max-sm:flex-col sm:justify-between items-center rounded-b-lg border-t p-4">
          <p className="text-sm text-muted-foreground">
            Last updated: 3rd June 2025
          </p>
          <Button>
            Upload
          </Button>
        </div>
      </div>
      <div
        className="border bg-primary-foreground dark:bg-background rounded-lg"
      >
        <div className="bg-background rounded-t-lg p-4 gap-4 flex flex-col">
          <h3 className="font-medium text-lg">Transcript</h3>
          <p className="text-sm">
            Your transcript provides recommenders with a record of your academic performance, which can help them assess your qualifications and achievements.
          </p>
          <div className="h-56 rounded-md bg-ground"></div>
        </div>
        <div className="md:gap-2 gap-4 flex max-sm:flex-col sm:justify-between items-center rounded-b-lg border-t p-4">
          <p className="text-sm text-muted-foreground">
            Last updated: 3rd June 2025
          </p>
          <Button>
            Upload
          </Button>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">CV, transcript, draft recommendation letters, certificates, etc.</p>
    </div>
  )
}
