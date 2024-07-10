


import React from 'react'
import Widget from '../../../components/widget'
import axios from 'axios'
import { Company, Form } from '@/types'

type Props = {params:{companySlug:string}}

const page =async ({params:{companySlug}}: Props) => {


  return (
    <div className="w-full h-full">
 
<Widget companySlug={companySlug} />
    </div>
  )
}

export default page