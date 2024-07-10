


import React from 'react'
import Widget from '../../../components/widget'
import axios from 'axios'
import { Company, Form } from '@/types'
import { SuccessProvider } from '@/contexts/success-context'

type Props = {params:{companySlug:string}}

const page =async ({params:{companySlug}}: Props) => {


  return (
    <div className="w-full h-full">
 <SuccessProvider>
 <Widget companySlug={companySlug} />
 </SuccessProvider>

    </div>
  )
}

export default page