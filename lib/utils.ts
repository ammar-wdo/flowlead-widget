import { ComparisonOperator, Element, Rule } from "@/types";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const evaluateCondition = (
  fieldValue: any,
  operator: ComparisonOperator,
  value: any
): boolean => {
  switch (operator) {
    case "CONTAINS":
      return fieldValue.includes(value);
    case "EMPTY":
      return !fieldValue || fieldValue.length === 0;
    case "NOT_EMPTY":
      return !!fieldValue && fieldValue.length > 0;
    case "IS":
      return fieldValue === value;
    case "IS_NOT":
      return fieldValue !== value;
    case "EQ":
      return fieldValue === +value;
    case "NEQ":
      return fieldValue !== +value;
    case "GT":
      return fieldValue > +value;
    case "LT":
      return fieldValue < +value;
    case "BEFORE":
      return new Date(fieldValue) < new Date(value);
    case "AFTER":
      return new Date(fieldValue) > new Date(value);
    default:
      return false;
  }
};

export const isFieldVisible = (
  elementId: string,
  rules: Rule[],
  elements: Element[],
  formValues: { [key: string]: any }
) => {
  let visible = true;

  for (const rule of rules) {
    const thenElementId = rule.then.field;
    const action = rule.then.action;

    let conditionsMet = rule.conditions.length > 0 ? true : false;

    if (rule.conditions.length === 1) {
      console.log("1 condition");

      const condition = rule.conditions[0];
      const conditionElement = elements.find(
        (element) => element.id === condition.field
      );
      if (!conditionElement) continue;

      const fieldKey = conditionElement.field
        ? `${conditionElement.field.label}-field`
        : conditionElement.service
        ? `${conditionElement.service.name}-service`
        : "";

      const fieldValue = formValues[fieldKey] ?? "";
      console.log("Field Value", fieldValue);
      console.log("operator", condition.operator);
      console.log("value", condition.value);
      //if entered value is array of objects mean it is a service so we take th id or check if enterd value is an array of only the chosen value with no other value then true, or if not an array then enter the value
      let enteredValue;

      if (Array.isArray(fieldValue)) {
        if (fieldValue.length === 1) {
          if (typeof fieldValue[0] === "string") {
            enteredValue = fieldValue[0];
          } else if (
            typeof fieldValue[0] === "object" &&
            fieldValue[0] !== null
          ) {
            enteredValue = fieldValue[0].id;
          } else {
            enteredValue = undefined;
          }
        } else {
          if (condition.operator === "NOT_EMPTY") {
            enteredValue = fieldValue;
          } else {
            enteredValue = undefined;
          }
        }
      } else {
        // Handle the case when fieldValue is not an array
        enteredValue = fieldValue;
      }
      console.log("entered value", enteredValue);

      conditionsMet = evaluateCondition(
        enteredValue,
        condition.operator,
        condition.value
      );
      console.log("Conditions Met", conditionsMet);
    } else {
      for (let i = 0; i < rule.conditions.length; i++) {
        const condition = rule.conditions[i];
        const conditionElement = elements.find(
          (element) => element.id === condition.field
        );
        if (!conditionElement) continue;

        const fieldKey = conditionElement.field
          ? `${conditionElement.field.label}-field`
          : conditionElement.service
          ? `${conditionElement.service.name}-service`
          : "";

        const fieldValue = formValues[fieldKey] ?? "";
        console.log("Field Value", fieldValue);
        console.log("operator", condition.operator);
        console.log("value", condition.value);
        //if entered value is array of objects mean it is a service so we take th id or check if enterd value is an array of only the chosen value with no other value then true, or if not an array then enter the value
        let enteredValue;

        if (Array.isArray(fieldValue)) {
          if (fieldValue.length === 1) {
            if (typeof fieldValue[0] === "string") {
              enteredValue = fieldValue[0];
            } else if (
              typeof fieldValue[0] === "object" &&
              fieldValue[0] !== null
            ) {
              enteredValue = fieldValue[0].id;
            } else {
              enteredValue = undefined;
            }
          } else {
            if (condition.operator === "NOT_EMPTY") {
              enteredValue = fieldValue;
            } else {
              enteredValue = undefined;
            }
          }
        } else {
          // Handle the case when fieldValue is not an array
          enteredValue = fieldValue;
        }
        console.log("entered value", enteredValue);
        const conditionMet = evaluateCondition(
          enteredValue,
          condition.operator,
          condition.value
        );
        console.log("Condition Met", conditionMet);

        if (i === 0) {
          conditionsMet = conditionMet;
        } else {
          const previousCondition = rule.conditions[i - 1];
          if (previousCondition.logicalOperator === "AND") {
            console.log("AND");
            console.log("operation", conditionsMet && conditionMet);
            conditionsMet = conditionsMet && conditionMet;
          } else if (previousCondition.logicalOperator === "OR") {
            console.log("OR");
            console.log("operation", conditionsMet || conditionMet);
            conditionsMet = conditionsMet || conditionMet;
          }
        }
        console.log("conditions met", conditionsMet);
      }
    }

    if (thenElementId === elementId) {
      console.log("Ids are equal");
      if (action === "SHOW" && !conditionsMet) {
        console.log(action);
        visible = false;
      } else if (action === "HIDE" && conditionsMet) {
        visible = false;
        console.log(action);
      }
    }
  }
  console.log("visible", visible);
  console.log("##########################");
  return visible;
};

export const generateSingleServiceSchema = (
  service: Element["service"],
  isRequired: boolean
) => {
  let serviceSchema: z.ZodTypeAny = z.string(); // Default value
  const optionSchema = z.object({
    id: z.string().min(1),
    price: z.coerce.number(),
    quantity: z.coerce.number(),
    name: z.string().min(1, "required"),
    description: z.string().optional(),
    image: z.string().optional(),
    serviceName: z.string().min(1),
    serviceId: z.string().min(1),
  });
  switch (service?.pricingType) {
    case "CHECKBOX_GROUP":
      serviceSchema = isRequired
        ? z.array(optionSchema).min(1, "At least one option")
        : z.array(optionSchema).optional();
      break;

    case "DROPDOWN_GROUP":
    case "RADIO_GROUP":
    case "SINGLE_PRICE":
      serviceSchema = isRequired ? optionSchema : optionSchema.optional();
      break;

    default:
      serviceSchema = z.string();
      break;
  }

  return serviceSchema;
};


export const generateSingleFieldSchema = (
  field: Element["field"],
  isRequired: boolean
) => {
  if (!field) return null;
  const dateTransformer = z.preprocess((val) => {
    if (typeof val === 'string' || val instanceof Date) {
      const date = new Date(val);
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
    return undefined;
  }, z.date().refine((val) => val !== undefined, {
    message: "Invalid date",
  }));
  let fieldSchema;

  switch (field.type) {
    case "name":
      fieldSchema = z.string().min(1, "Required");
      break;
    case "email":
      fieldSchema = z.string().email();
      break;
      case "number":
        fieldSchema = z
          .coerce.number({invalid_type_error:"enter valid number"})
          .refine((val) => !val || !isNaN(Number(val)), {
            message: "Please enter a valid number",
          })
          .transform((val) => (val ? Number(val) : undefined));
  
        if (field.validations) {
          const { min, max } = field.validations;
  
          if (!!min) {
            fieldSchema = fieldSchema.refine(
              (val) => val === undefined || val >= min,
              {
                message: `Value should be greater than or equal to ${min}`,
              }
            );
          }
  
          if (!!max) {
            fieldSchema = fieldSchema.refine(
              (val) => val === undefined || val <= max,
              {
                message: `Value should be less than or equal to ${max}`,
              }
            );
          }
        }
  
        if (!isRequired) {
          fieldSchema = fieldSchema.optional();
        } else {
          fieldSchema = fieldSchema.refine((val) => val !== undefined, {
            message: "Required",
          });
        }
        break;
  
      case "phone":
        fieldSchema = z
          .string()
          .refine((value) => {
  const phoneRegex = /^(?:[0-9]){1,3}(?:[ -]*[0-9]){6,14}$/;
  return phoneRegex.test(value);
}, "Invalid phone number").or(z.literal(undefined)).or(z.literal(''));;
  
        if (!isRequired) {
          fieldSchema = fieldSchema.optional();
        } else {
          fieldSchema = fieldSchema.refine((val) => val !== undefined, {
            message: "Required",
          }).refine(val=>val !=='', {
            message: "Required",
          });
        }
        break;
  

    case "text":
    case "radio":
    case "select":
    case "longText":
      fieldSchema = z.string();
      if (field.validations) {
        const { minLength, maxLength, pattern } = field.validations;
        if (pattern) fieldSchema = fieldSchema.regex(new RegExp(pattern));
        if (minLength !== undefined && minLength !== null)
          fieldSchema = fieldSchema.min(minLength);
        if (maxLength !== undefined && maxLength !== null)
          fieldSchema = fieldSchema.max(maxLength);
      }
      if (isRequired) {
        fieldSchema = fieldSchema.min(1, "Required");
      } else {
        fieldSchema = fieldSchema.optional();
      }
      break;

    case "checkbox":
      fieldSchema = z.array(z.string());
      if (isRequired) {
        fieldSchema = fieldSchema.min(1, "Choose at least one option");
      } else {
        fieldSchema = fieldSchema.optional();
      }
      break;
    case "address":
      fieldSchema = isRequired
        ? z.object({
            address:
              field.address?.addressShow && isRequired
                ? z.string().min(1, "Required")
                : z.string().optional(),
            houseNumber:
              field.address?.houseNumberShow && isRequired
                ? z.string().min(1, "Required")
                : z.string().optional(),
            postalCode:
              field.address?.postalCodeShow && isRequired
                ? z.string().min(1, "Required")
                : z.string().optional(),
            city:
              field.address?.cityShow && isRequired
                ? z.string().min(1, "Required")
                : z.string().optional(),
            stateRegion:
              field.address?.stateRegionShow && isRequired
                ? z.string().min(1, "Required")
                : z.string().optional(),
            country:
              field.address?.countryShow && isRequired
                ? z.string().min(1, "Required")
                : z.string().optional(),
          })
        : z
            .object({
              address:
                field.address?.addressShow && isRequired
                  ? z.string().min(1, "Required")
                  : z.string().optional(),
              houseNumber:
                field.address?.houseNumberShow && isRequired
                  ? z.string().min(1, "Required")
                  : z.string().optional(),
              postalCode:
                field.address?.postalCodeShow && isRequired
                  ? z.string().min(1, "Required")
                  : z.string().optional(),
              city:
                field.address?.cityShow && isRequired
                  ? z.string().min(1, "Required")
                  : z.string().optional(),
              stateRegion:
                field.address?.stateRegionShow && isRequired
                  ? z.string().min(1, "Required")
                  : z.string().optional(),
              country:
                field.address?.countryShow && isRequired
                  ? z.string().min(1, "Required")
                  : z.string().optional(),
            })
            .optional()
            .default({});

      break;
    case "date":
      fieldSchema = dateTransformer;
      if (!isRequired) {
        fieldSchema = fieldSchema.optional();
      } else {
        fieldSchema = fieldSchema.refine((val) => val !== undefined, {
          message: "Required",
        });
      }
      break;
    default:
      fieldSchema = z.string();
      if (isRequired) {
        fieldSchema = fieldSchema.min(1, "Required");
      } else {
        fieldSchema = fieldSchema.optional();
      }
      break;
  }

  return fieldSchema;
};


export const generateZodSchema = (
  elements: Element[],
  rules: Rule[],
  formValues: { [key: string]: any }
) => {
  const zodSchema: { [key: string]: z.ZodTypeAny } = {};

  elements.forEach((element) => {
    const field = element.field;
    const isFieldRequired =
      !!field?.validations?.required &&
      isFieldVisible(element.id, rules, elements, formValues);

    const fieldSchema = generateSingleFieldSchema(field, !!isFieldRequired);

    if (field && fieldSchema) {
      zodSchema[`${field.label}-field`] = fieldSchema;
    }

    const service = element.service;
    const isServiceRequired =
      service?.isRequired &&
      isFieldVisible(element.id, rules, elements, formValues);
    const serviceSchema = generateSingleServiceSchema(
      service,
      !!isServiceRequired
    );

    if (service && serviceSchema) {
      zodSchema[`${service.name}-service`] = serviceSchema;
    }
  });

  return z.object(zodSchema);
};


export type StepsWithLabels ={
  steps: Element[][];
  labels: (string | null)[];
}


export function groupElementsBySteps(elements: Element[]): StepsWithLabels {
  const steps: Element[][] = [];
  const labels: (string | null)[] = [];
  let currentStep: Element[] = [];

  elements.forEach((element) => {
    if (element.field?.type === 'breaker') {
      if (currentStep.length > 0) {
        steps.push(currentStep);
        currentStep = [];
      }
      labels.push(element.field?.placeholder || null); // Save the breaker label
    } else {
      currentStep.push(element);
    }
  });

  if (currentStep.length > 0) {
    steps.push(currentStep);
    labels.push(null); // No breaker after the last step
  }

  return { steps, labels };
}
