import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from "react";

type SuccessType = {
    open:boolean,
    setOpen:Dispatch<SetStateAction<boolean>>
}

const initialValues:SuccessType ={
    open:false,
    setOpen:()=>{}
}
const SuccessContext = createContext<SuccessType>(initialValues)



export const SuccessProvider = ({children}:{children:ReactNode})=>{

    const [open, setOpen] = useState(false)
    return (
       <SuccessContext.Provider  value={{open,setOpen}}> {children}</SuccessContext.Provider>
    )
}


export const useOpenSuccess = ()=>useContext(SuccessContext)