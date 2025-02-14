'use client'

import { Company, Form, WidgetSettings } from "@/types";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";






export const useWidget = (slug:string)=>{
    

    const fetchWidgetCompany = async()=>{
        const { data } = await axios.get<{success:boolean,data?:Company & {forms:Form[],widgetSettings:WidgetSettings}}>(`${process.env.NEXT_PUBLIC_BACKEND_URL!}/api/company/${slug}`);
        return data.data;
    }


return useQuery({
    queryKey:['widget'],
    queryFn:fetchWidgetCompany
})

}