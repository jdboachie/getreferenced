'use client';

import * as React from 'react'

const Page = () => {

  const randomID = React.useId()

  return (
    <div>
      {randomID}
    </div>
  )
}

export default Page