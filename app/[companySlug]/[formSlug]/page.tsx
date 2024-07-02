import FormComponent from '@/components/form-component'
import { Form, FormWithCompany } from '@/types'
import axios from 'axios'
import React from 'react'

type Props = {
    params:{companySlug:string,formSlug:string}
}

const page = async({params:{companySlug,formSlug}}: Props) => {


  const {data} = await axios.get<{success:boolean,error?:"message",data?:FormWithCompany}>(`${process.env.NEXT_PUBLIC_BACKEND_URL!}/api/form/${formSlug}`)

console.log(data)
if(!data.success || !data.data)

  return <div className='min-h-screen flex items-center justify-center'>
    <h3 className='text-rose-500 font-semibold'>Ooops...Something went wrong</h3>
  </div>

  return (
    <div>
 <FormComponent form={data.data} />
    </div>
  )
}

export default page