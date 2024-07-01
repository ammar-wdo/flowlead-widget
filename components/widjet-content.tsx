import { Company, Form } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import React, { useState } from "react";

type Props = {};

const WidgetContent = (props: Props) => {
  const queryClient = useQueryClient();
  const company = queryClient.getQueryData(["widget"]) as Company & {
    forms: Form[];
  };
  const [selectedForm, setSelectedForm] = useState<string | undefined>(
    undefined
  );
  const forms = company.forms;
  const oneForm = forms.length === 1;
  const form = forms[0];
  return (
    <div className="p-3">
        <div className="flex items-center gap-3">
            {selectedForm && <button onClick={()=>setSelectedForm(undefined)}><ArrowLeft/></button>}
        <h3 className="font-bold">{company.name}</h3>
        </div>
   
      {/* one form */}
    
        {oneForm ? (
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
          >
            <SelectedForm form={form} />
          </motion.div>
        ) :   <AnimatePresence mode="wait">{ !selectedForm ? (
          <motion.section
          key={'form-list'}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="flex flex-col gap-2 mt-3"
          >
            {forms.map((form) => (
              <article
                onClick={() => setSelectedForm(form.id)}
                key={form.id}
                className="border hover:border-gray-400 rounded-xl p-3 cursor-pointer   transition "
              >
                <h4 className="font-semibold text-muted-foreground">
                  {form.name}
                </h4>
                {form.description && (
                  <p
                    className="text-xs text-gray-400"
                    dangerouslySetInnerHTML={{ __html: form.description }}
                  />
                )}
              </article>
            ))}
          </motion.section>
        ) : (
          <motion.div
          key={'selected-form'}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
          >
            <SelectedForm form={forms.find((el) => el.id === selectedForm)!} />
          </motion.div>
        )}</AnimatePresence>}
  
    </div>
  );
};

export default WidgetContent;

const SelectedForm = ({ form }: { form: Form }) => {
  return (
    <section className="mt-4">
      <h4 className="font-semibold text-muted-foreground">{form.name}</h4>
    </section>
  );
};
