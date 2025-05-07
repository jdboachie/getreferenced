import React from 'react'

const PageTitle = ({title}: {title: string}) => {
  return (
    <h1 className="font-medium text-3xl py-2">{title}</h1>
  )
}

export default PageTitle