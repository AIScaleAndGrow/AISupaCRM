import * as z from "zod";

export const userAccountSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  picture: z.string().optional(),
  phoneNumber: z.string().min(1, "Phone number is required"),
  jobTitle: z.string().min(1, "Job title is required"),
});

export const addressSchema = z.object({
  formattedAddress: z.string().min(1, "Address is required"),
  street: z.string(),
  suburb: z.string(),
  state: z.string(),
  country: z.string(),
  zipCode: z.string(),
});

export const companyDetailsSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  website: z.string()
    .transform(val => val.startsWith('http') ? val : `https://${val}`)
    .pipe(z.string().url('Please enter a valid URL'))
    .optional()
    .or(z.literal("")),
  industry: z.string().min(1, "Industry is required"),
  companySize: z.string().min(1, "Company size is required"),
  address: addressSchema,
});

export type UserAccountFormData = z.infer<typeof userAccountSchema>;
export type CompanyDetailsFormData = z.infer<typeof companyDetailsSchema>;

export const AVAILABLE_INDUSTRIES = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Manufacturing",
  "Retail",
  "Other",
] as const;

export const AVAILABLE_COMPANY_SIZES = [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "501-1000",
  "1000+",
] as const;
