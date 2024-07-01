import React from 'react'

type Props = {
    params:{companySlug:string,formId:string}
}

const page = ({params:{companySlug,formId}}: Props) => {
  return (
    <div>
        company: {companySlug}
        <br/>
        form: {formId}
    </div>
  )
}

export default page