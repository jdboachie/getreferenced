const TitleBlock = ({title, children}: {title: string, children?: React.ReactNode}) => {
  return (
    <div className='py-8 mb-8 sm:py-10 sm:mb-10 max-lg:px-5 border-b'>
      <div className="max-w-6xl mx-auto size-full grid gap-10 sm:flex sm:justify-between ">
        <h1 className='text-3xl max-sm:text-[1.8rem] font-medium'>{title}</h1>
        {children}
      </div>
    </div>
  )
}

export default TitleBlock