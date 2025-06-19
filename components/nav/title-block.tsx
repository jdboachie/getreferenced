import React from 'react'

const TitleBlock = ({title, children}: {title: string, children?: React.ReactNode}) => {
  return (
    <div className='py-8 mb-8 sm:py-10 sm:mb-10 max-lg:px-5 border-b'>
      <div className="max-w-6xl mx-auto size-full grid gap-5 sm:flex justify-between ">
        <h1 className='text-2xl sm:text-3xl font-medium'>{title}</h1>
        {children}
      </div>
    </div>
  )
}

export default TitleBlock