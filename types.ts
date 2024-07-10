import { z } from "zod"


const requiredString = z.string().min(1, "Required field");
const optionalString = z.string().optional();

const companySchema = z.object({
  id: z.string().optional(), // Assuming `auto()` generates an ID, it might be optional on creation
  createdAt: z.date().optional(), // Automatically set, might not need to be provided by user
  updatedAt: z.date().optional(), // Automatically set, might not need to be provided by user
  userId: z.string(),
  slug: z.string(),

  name: z.string(),
  address: z.string(),
  zipcode: z.string(),
  city: z.string(),
  country: z.string(),
  websiteUrl: z.string().url().optional(),
  logo: z.string().optional(),
  phone: z.string(),
  companyEmail: z.string().email(),

  cocNumber: z.string().optional(),
  industry: z.string().optional(),
  vatNumber: z.string().optional(),
  contactPerson: z.string(),
  IBAN: z.string().optional(),
  termsUrl: z.string().url().optional(),
});

const addressSchema = z
  .object({
    addressLabel: z.string().optional().nullable(),
    addressShow: z.boolean().optional().nullable().default(true),
    houseNumberLabel: z.string().optional().nullable(),
    houseNumberShow: z.boolean().optional().nullable().default(true),
    postalCodeLabel: z.string().optional().nullable(),
    postalCodeShow: z.boolean().optional().nullable().default(true),
    cityLabel: z.string().optional().nullable(),
    cityShow: z.boolean().optional().nullable().default(true),
    stateRegionLabel: z.string().optional().nullable(),
    stateRegionShow: z.boolean().optional().nullable().default(true),
    countryLabel: z.string().optional().nullable(),
    countryShow: z.boolean().optional().nullable().default(true),
  })
  .optional()
  .nullable();

  const validationOptionsSchema = z.object({
    required: z.boolean().nullable().optional(),
    minLength: z.coerce.number().nullable().optional(),
    maxLength: z.coerce.number().nullable().optional(),
    min: z.coerce.number().nullable().optional(),
    max: z.coerce.number().nullable().optional(),
    pattern: z.string().nullable().optional(),
  });
const fieldTypeArray =[
    'email',
    'name',
    'text',
    'longText',
    'number',
    'select',
    'radio',
    'checkbox',
    'address',
    'phone',
    'breaker',
    'sectionBreaker',
    'date'
  ]

  export const fieldTypeConst = [
    'email',
    'name',
    'text',
    'longText',
    'number',
    'select',
    'radio',
    'checkbox',
    'address',
    'phone',
    'breaker',
    'sectionBreaker',
    'date'
  ] as const


  const pricingTypeArray = [
    'SINGLE_PRICE',
    'CHECKBOX_GROUP',
    'RADIO_GROUP',
    'DROPDOWN_GROUP'
  ]

  const pricingTypeConst =[
    'SINGLE_PRICE',
    'CHECKBOX_GROUP',
    'RADIO_GROUP',
    'DROPDOWN_GROUP'
  ] as const

  export const comparisonOperatorArray = [
    "CONTAINS",
    "EMPTY",
    "NOT_EMPTY",
    "IS",
    "IS_NOT",
    "EQ",
    "NEQ",
    "GT",
    "LT",
    "BEFORE",
    "AFTER",
  ];

 const  comparisonOperatorConst =[
    "CONTAINS",
    "EMPTY",
    "NOT_EMPTY",
    "IS",
    "IS_NOT",
    "EQ",
    "NEQ",
    "GT",
    "LT",
    "BEFORE",
    "AFTER",
  ] as const

  const actionArray = ["SHOW","HIDE"]
  const actionConst = ["SHOW","HIDE"] as const
   const logicOperatorArray = ["AND", "OR", "NOT"];
 const logicOperatorConst = ["AND", "OR", "NOT"] as const;

  const elementTypeArray= ["FIELD","SERVICE_ELEMENT"]
  const elemetnTypeConst = ["FIELD","SERVICE_ELEMENT"] as const
const fieldSchema = z.object({
    id: requiredString,
    label: requiredString,
    placeholder: optionalString.nullable().optional(),
    hint: optionalString.nullable().optional(),
    type: z.enum(fieldTypeConst),
    options: z.array(requiredString),
    address: addressSchema.optional().nullable(),
    validations: validationOptionsSchema.nullable().optional(),
  });

  const optionSchema = z.object({
    id: requiredString,
    name: requiredString,
    description: optionalString.nullable().optional(),
    image: optionalString.nullable().optional(),
    enableQuantity: z.boolean(),
    price: z.coerce.number({ message: "Enter valid number please" }).min(1),
    taxPercentage:z.coerce.number().optional()
  });

  const serviceSchema = z.object({
    id: z.string().optional(), // Assuming `auto()` generates an ID, it might be optional on creation
    createdAt: z.date().optional(), // Automatically set, might not need to be provided by user
    updatedAt: z.date().optional(), // Automatically set, might not need to be provided by user
    userId: z.string(),
  
    name: z.string(),
    description: z.string().optional(),
    pricingType: z.enum(pricingTypeConst),
    isRequired: z.boolean().default(false),
    isLineItem: z.boolean().default(false),
    taxPercentage: z.number(),
    options: z.array(optionSchema),
    addToQoutation: z.boolean().default(false),
  
    accountId: z.string(),
    forms: z.array(z.string()),
  
    companyId: z.string()
  });
  
  export const elementSchema = z.object({
    id: requiredString,
    type: z.enum(elemetnTypeConst),
    field: fieldSchema.nullable().optional(),
    service: serviceSchema
      .extend({
        id: requiredString,
      })
      .nullable()
      .optional(),
  });
  const conditionSchema = z
  .object({
    id: requiredString,
    field: requiredString,
    operator: z.enum(comparisonOperatorConst),
    value: optionalString, // Using z.union to accommodate various types of values
    logicalOperator: z.enum(logicOperatorConst).nullable().optional(),
  })
  .refine(
    (data) =>
      data.operator === "NOT_EMPTY" || data.operator === "EMPTY" || data.value,
    { message: "Required", path: ["value"] }
  );
  const thenSchema = z.object({
    field: requiredString,
    action: z.enum(actionConst),
  });
 const ruleSchema = z.object({
  id: requiredString,
  conditions: z.array(conditionSchema),
  then: thenSchema,
});

const formSchema = z.object({
    id: z.string().optional(), // Assuming `auto()` generates an ID, it might be optional on creation
    createdAt: z.date().optional(), // Automatically set, might not need to be provided by user
    updatedAt: z.date().optional(), // Automatically set, might not need to be provided by user
    userId: z.string(),
  
    name: z.string(),
    description: z.string().optional(),
    slug: z.string(),
    logo:optionalString,
  
    isPublished: z.boolean().default(false),
    isWidjet: z.boolean().default(false),
  
    elements: z.array(elementSchema),
    rules: z.array(ruleSchema),
  
 
  

  
    accountId: z.string(),
    companyId: z.string()
  });

  export type Company = z.infer<typeof companySchema>
  export type Form = z.infer<typeof formSchema> 
  export type FormWithCompany = Form & {company:{name:string,companyEmail:string}}
  export type ComparisonOperator =  typeof comparisonOperatorConst[number]
  export type Rule = z.infer<typeof ruleSchema>
  export type Element = z.infer<typeof elementSchema>
  export type FieldType = typeof fieldTypeConst[number]
  export type Service = z.infer<typeof serviceSchema>

  export type WidgetSettings ={
    color:string,
    widgetButtonText:string,
    thankyouText:string
  }