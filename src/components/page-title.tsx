import React from 'react'

const PageTitte = ({title}: {title: string}) => {
  return (
    <div className='py-2'>
      <h1 className="font-medium text-3xl">{title}</h1>
    </div>
  )
}

export default PageTitte