export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='flex max-md:flex-col gap-12 w-full'>
      {children}
    </div>
  )
}
