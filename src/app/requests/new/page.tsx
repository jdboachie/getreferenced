import PageTitle from "@/components/page-title"
import { RecommendationForm, RecommendationSummary } from "@/components/forms/recommendation-request-form"

export default function Page() {
  return (
    <div className='grid gap-4'>
      <PageTitle title='New Request' />
      <div className='flex flex-col-reverse lg:grid lg:grid-cols-12 gap-4'>
        <div className="summary lg:col-span-4 h-fit sticky top-[160px] bg-background border p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Summary</h3>
          <RecommendationSummary />
        </div>
        <div className="form lg:col-span-8 bg-background border px-8 py-12 rounded-lg">
          <RecommendationForm />
        </div>
      </div>
    </div>
  );
}
