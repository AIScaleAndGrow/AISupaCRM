import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useAuth } from '@/contexts/AuthContext';
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
import { StepProps, UserInformationInputs } from '../types';
import { logger } from '@/utils/logger';

const departments = [
  'Engineering',
  'Design',
  'Product',
  'Marketing',
  'Sales',
  'Operations',
  'Other'
] as const;

const formSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').regex(/^[^0-9]+$/, 'Name cannot contain numbers'),
  email: z.string().email('Please enter a valid email address'),
  phoneNumber: z.string().min(10, 'Please enter a valid phone number'),
  jobTitle: z.string().min(2, 'Job title must be at least 2 characters'),
  department: z.enum(departments, {
    required_error: 'Please select a department',
  }),
});

export default function UserInformationStep({
  data,
  onComplete,
  onBack,
}: StepProps<UserInformationInputs>) {
  const { user } = useAuth();
  const form = useForm<UserInformationInputs>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: data?.fullName || user?.displayName || '',
      email: data?.email || user?.email || '',
      phoneNumber: data?.phoneNumber || '',
      jobTitle: data?.jobTitle || '',
      department: data?.department || undefined,
    },
  });

  const onSubmit = async (values: UserInformationInputs) => {
    try {
      logger.info('User information step completed', values);
      onComplete(values);
    } catch (error) {
      logger.error('Error in user information step', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto" noValidate>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter your full name" className="max-w-[300px]" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="email" 
                    disabled 
                    className="max-w-[300px] bg-muted cursor-not-allowed" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <PhoneInput
                    country="au"
                    value={field.value}
                    onChange={(phone) => field.onChange(phone)}
                    containerClass="max-w-[300px]"
                    inputClass="!w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="jobTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter your job title" className="max-w-[300px]" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="max-w-[300px]">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {departments.map((department) => (
                      <SelectItem key={department} value={department}>
                        {department}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit">Continue</Button>
        </div>
      </form>
    </Form>
  );
}
