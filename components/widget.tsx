"use client";

import { useState } from "react";

import { AnimatePresence } from "framer-motion";
import { useWidget } from "../hooks/widget-info";
import Motion from "./motion";
import { ArrowLeft, ChevronDown, Loader, XIcon } from "lucide-react";
import WidgetContent from "./widjet-content";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { useOpenSuccess } from "@/contexts/success-context";

type Props = {
  companySlug: string;
};

export const Widget = ({ companySlug }: Props) => {
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(
    !!(searchParams.get("openWidget") === "true")
  );
  const { data: company, isLoading, isError, error } = useWidget(companySlug);
  console.log("company", company);
  const [selectedForm, setSelectedForm] = useState<string | undefined>(
    undefined
  );

  const { open: openSuccess, setOpen: setOpenSuccess } = useOpenSuccess();

  if (!company) return null;

  return (
    <div className="">
      <AnimatePresence>
        {open && (
          <Motion
            style={{ backgroundColor: company.widgetSettings.color }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="     rounded-3xl   p-2  flex-1  z-[999]  fixed bottom-0   right-0   w-full   overflow-y-auto noScroll  "
          >
            {isLoading && (
              <div className=" flex items-center justify-center   bg-white flex-col    h-[98.9vh]">
                <Loader size={20} className="animate-spin block" />
                <p className="mt-4 text-xl text-gray-400">Loading Data...</p>
              </div>
            )}
            {isError && (
              <div className="bg-white h-[98.6vh] flex items-center justify-center">
                <p className="mt-4 text-xl font-semibold text-rose-500">
                  Oops...Something went wrong!
                </p>
              </div>
            )}
            {company && (
              <div className="bg-white rounded-3xl sm:rounded-2xl h-[98.6vh]   overflow-y-hidden relative ">
                <div className="flex items-center justify-between px-3   border-b h-12">
                  {selectedForm ? (
                    <button
                      type="button"
                      title="back"
                      onClick={() => setSelectedForm(undefined)}
                      className="flex  items-center justify-center   gap-2   "
                    >
                      <span className="w-8 h-8 rounded-full bg-white items-center justify-center  flex hover:bg-muted transition">
                        <ArrowLeft />{" "}
                      </span>{" "}
                      <span>Go Back</span>
                    </button>
                  ) : (
                    <span />
                  )}
                  {!selectedForm && company.forms.length > 1 && (
                    <p>Choose Form</p>
                  )}
                  <button
                    type="button"
                    title="close"
                    onClick={() => {
                      setOpen(false);
                      setSelectedForm(undefined);
                      window.parent.postMessage("close-widget", "*");
                    }}
                    className="flex  items-center justify-center w-8 h-8   rounded-full bg-white hover:bg-muted transition"
                  >
                    <XIcon />
                  </button>
                </div>
                <AnimatePresence mode="wait">
                  {openSuccess ? (
                    <Motion
                    key={'thank you'}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="h-[calc(98vh-50px)] flex items-center flex-col justify-center p-4"
                    >
                      {company.widgetSettings.thankyouText}
                      <button
                        onClick={() => {
                          setOpenSuccess(false);
                          setSelectedForm(undefined);
                        }}
                        className="p-1 border-transparent  border-2 rounded-md hover:opacity-90 transition  justify-center  flex items-center  mt-auto  w-full h-[50px] text-sm text-white     font-semibold "
                        style={{
                          backgroundColor: company.widgetSettings.color,
                        }}
                      >
                        Close
                      </button>
                    </Motion>
                  ) : (
                    <Motion
                    key={'content'}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <WidgetContent
                        selectedForm={selectedForm}
                        setSelectedForm={setSelectedForm}
                      />
                    </Motion>
                  )}
                </AnimatePresence>
              </div>
            )}
          </Motion>
        )}
      </AnimatePresence>
      <button
        style={{ backgroundColor: company.widgetSettings.color }}
        onClick={() => {
          setOpen((prev) => !prev);
          window.parent.postMessage(open ? "close-widget" : "open-widget", "*");
        }}
        type="button"
        className={cn(
          "p-1 border-transparent  border-2 rounded-md hover:opacity-90 transition  justify-center  flex items-center ml-auto fixed bottom-0 right-0 w-[150px] h-[50px] text-sm text-white     font-semibold ",
          open && "opacity-0 pointer-events-none "
        )}
      >
        {company.widgetSettings.widgetButtonText}
        <ChevronDown
          size={13}
          className={
            open
              ? "rotate-180 transition ml-3 shrink-0"
              : "transition ml-3 shrink-0"
          }
        />
      </button>
    </div>
  );
};

export default Widget;
