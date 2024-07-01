"use client";

import { useState } from "react";

import { AnimatePresence } from "framer-motion";
import { useWidget } from "../hooks/widget-info";
import Motion from "./motion";
import { Loader } from "lucide-react";

type Props = {
  companySlug: string;
};

const Widget = ({ companySlug }: Props) => {
  const [open, setOpen] = useState(false);
  const { data: company, isLoading, isError, error } = useWidget(companySlug);
  return (
    <div className="min-w-[400px] w-[550px]">
      <AnimatePresence>
        {open && (
          <Motion
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className=" mb-3   w-full   z-[999]"
          >
            <article className="rounded-lg bg-black p-3 h-[800px] overflow-y-auto">
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
                  <h3 className="p-2">{company?.name}</h3>
                </div>
              )}
            </article>
          </Motion>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen((prev) => !prev)}
        type="button"
        className="p-1  border rounded-lg  w-full bg-white font-semibold "
      >
        Widget
      </button>
    </div>
  );
};

export default Widget;
