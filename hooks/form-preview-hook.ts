import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import {
  generateZodSchema,
  groupElementsBySteps,
  isFieldVisible,
} from "@/lib/utils";
import { toast } from "sonner";

import { FormWithCompany } from "@/types";
import axios from "axios";
import { useOpenSuccess } from "@/contexts/success-context";

export const useFormPreview = (form: FormWithCompany) => {
  const {setOpen} = useOpenSuccess()
  const [schema, setSchema] = useState(
    generateZodSchema(form.elements, form.rules, {})
  );

  const formPreview: UseFormReturn<z.infer<typeof schema>> = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
    reValidateMode: "onChange",
    criteriaMode: "all",
    defaultValues: {},
  });

  const formValues = formPreview.watch();
  const hiddenFieldsRef = useRef<string[]>([]);

  // Function to evaluate visibility and update schema
  const evaluateAndUpdateSchema = () => {
    const newHiddenFields: string[] = [];
    form.elements.forEach((element) => {
      const isVisible = isFieldVisible(
        element.id,
        form.rules,
        form.elements,
        formValues
      );
      if (!isVisible) {
        const fieldKey = element.field
          ? `${element.field.label}-field`
          : element.service
          ? `${element.service.name}-service`
          : "";
        newHiddenFields.push(fieldKey);
      }
    });

    const hiddenFieldsChanged =
      JSON.stringify(hiddenFieldsRef.current) !==
      JSON.stringify(newHiddenFields);

    if (hiddenFieldsChanged) {
      hiddenFieldsRef.current = newHiddenFields;
      newHiddenFields.forEach((fieldKey) => {
        formPreview.setValue(fieldKey, undefined, { shouldDirty: true });
      });
      const updatedSchema = generateZodSchema(
        form.elements,
        form.rules,
        formValues
      );
      setSchema(updatedSchema);
    }
  };

  // Effect to update schema when formValues change
  useEffect(() => {
    evaluateAndUpdateSchema();
  }, [formValues, form.elements, form.rules]);

  // Handle form submission
  async function onSubmit(values: z.infer<typeof schema>) {
    // return alert(JSON.stringify(values,undefined,2))
    try {
      const formValues = formPreview.watch();
// alert(JSON.stringify(formValues))
      const { data } = await axios.post<{
        success: boolean;
        error?: string;
        message?: string;
      }>(`${process.env.NEXT_PUBLIC_BACKEND_URL!}/api/submission`, {
        values:values,
        companyId: form.companyId,
        elements: form.elements,
        formValues: formValues,
        rules: form.rules,
      });
      if (!data.success) return toast.error(data.error);

      toast.success(data.message);
      setOpen(true)
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  }

  const { steps, labels } = groupElementsBySteps(form.elements); // Group form elements into steps
  const [currentStep, setCurrentStep] = useState(0); // State to track the current step

  return {
    formPreview,
    onSubmit,
    handleBlur: evaluateAndUpdateSchema,
    steps,
    currentStep,
    setCurrentStep,
    labels,
  };
};
