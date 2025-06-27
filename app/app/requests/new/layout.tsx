import { Steps } from "../components/steps"

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='flex max-md:flex-col gap-12 w-full'>
      <Steps />
      {children}
    </div>
  )
}
