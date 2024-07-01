


import React from 'react'
import Widget from '../../../components/widget'
import axios from 'axios'
import { Company, Form } from '@/types'

type Props = {params:{companySlug:string}}

const page =async ({params:{companySlug}}: Props) => {


  return (
    <div className="fixed right-1 bottom-1">

<Widget companySlug={companySlug} />
    </div>
  )
}

export default page