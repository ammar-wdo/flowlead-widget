


import React from 'react'
import Widget from '../components/widget'

type Props = {params:{companySlug:string}}

const page =async ({params:{companySlug}}: Props) => {


  return (
    <div className="widget-container  min-h-[400px]">
        hello
<Widget companySlug={companySlug} />
    </div>
  )
}

export default page