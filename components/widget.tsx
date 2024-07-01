"use client";

import { useState } from "react";

import { AnimatePresence } from "framer-motion";
import { useWidget } from "../hooks/widget-info";
import Motion from "./motion";
import { ChevronDown, Loader } from "lucide-react";
import WidgetContent from "./widjet-content";
import { useSearchParams } from "next/navigation";

type Props = {
  companySlug: string;

};

const Widget = ({ companySlug }: Props) => {

  const searchParams = useSearchParams()
  const [open, setOpen] = useState(!!(searchParams.get('openWidget')==="true"));
  const { data: company, isLoading, isError, error } = useWidget(companySlug);

  
  return (
    <div className="w-[98vw]  lg:min-w-[500px]   max-w-[600px]">
  
      <AnimatePresence>
        {open && (
          <Motion
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className=" mb-3   w-full   z-[999]"
          >
            <article className="rounded-lg bg-black p-3 h-[85vh] sm:h-[80vh] md:h-[800px] max-h-[85vh]   overflow-y-auto">
              {isLoading && (
                <div className=" flex items-center justify-center h-full bg-white flex-col">
                  <Loader size={20} className="animate-spin block" />
                  <p className="mt-4 text-xl text-gray-400">Loading Data...</p>
                </div>
              )}
              {isError && (
                <div className="bg-white h-full flex items-center justify-center">
                  <p className="mt-4 text-xl font-semibold text-rose-500">
                    Oops...Something went wrong!
                  </p>
                </div>
              )}
              {company && (
                <div className="bg-white rounded-md h-full">
                 <WidgetContent/>
                </div>
              )}
            </article>
          </Motion>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen((prev) => !prev)}
        type="button"
        className="p-1 border-transparent  border-2 rounded-md  w-fit py-4 px-8 bg-black flex items-center ml-auto  text-white hover:bg-black/80 transition font-semibold "
      >
        Widget
        <ChevronDown className={open ? "rotate-180 transition ml-3" :"transition ml-3"} />
      </button>
    </div>
  );
};

export default Widget;
