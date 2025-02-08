import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { StepProps, CompanyDetailsInputs } from '../types';
import GoogleAddressAutocomplete from "@/components/ui/GoogleAddressAutocomplete";
import { logger } from '@/utils/logger';

const industries = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Manufacturing',
  'Retail',
  'Other',
] as const;

const companySizes = [
  '1-10',
  '11-50',
  '51-200',
  '201-500',
  '501-1000',
  '1000+',
] as const;

const formSchema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  website: z.string()
    .transform(val => val.startsWith('http') ? val : `https://${val}`)
    .pipe(z.string().url('Please enter a valid URL'))
    .optional()
    .or(z.literal('')),
  industry: z.enum(industries, {
    required_error: 'Please select an industry',
  }),
  companySize: z.enum(companySizes, {
    required_error: 'Please select a company size',
  }),
  address: z.object({
    formattedAddress: z.string().min(1, 'Address is required'),
    street: z.string(),
    suburb: z.string(),
    state: z.string(),
    country: z.string(),
    zipCode: z.string(),
  }),
});

export default function CompanyDetailsStep({
  data,
  onComplete,
  onBack,
}: StepProps<CompanyDetailsInputs>) {
  const form = useForm<CompanyDetailsInputs>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: data?.companyName || '',
      website: data?.website || '',
      industry: data?.industry || undefined,
      companySize: data?.companySize || undefined,
      address: data?.address || {
        formattedAddress: '',
        street: '',
        suburb: '',
        state: '',
        country: '',
        zipCode: '',
      },
    },
  });

  const onSubmit = async (values: CompanyDetailsInputs) => {
    try {
      logger.info('Company details step completed', values);
      onComplete(values);
    } catch (error) {
      logger.error('Error in company details step', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto" noValidate>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter company name" className="max-w-[300px]" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="https://example.com" className="max-w-[300px]" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="industry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Industry</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="max-w-[300px]">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="companySize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Size</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="max-w-[300px]">
                      <SelectValue placeholder="Select company size" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {companySizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="max-w-[300px]">
          <FormField
            control={form.control}
            name="address.formattedAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <GoogleAddressAutocomplete
                  value={field.value}
                  onChange={field.onChange}
                  onAddressSelect={(addressData) => {
                    form.setValue('address', addressData);
                  }}
                  className="max-w-[300px]"
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="outline" onClick={() => onBack('slide')}>
            Back
          </Button>
          <Button type="submit">
            Continue
          </Button>
        </div>
      </form>
    </Form>
  );
}
