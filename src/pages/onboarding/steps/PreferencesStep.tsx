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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { StepProps, UserPreferencesInputs } from '../types';
import { logger } from '@/utils/logger';

const interests = [
  'Web Development',
  'Mobile Development',
  'UI/UX Design',
  'Data Science',
  'DevOps',
  'Machine Learning',
  'Cloud Computing'
] as const;

const formSchema = z.object({
  interests: z.array(z.enum(interests)).min(1, 'Please select at least one interest'),
});

export default function PreferencesStep({
  data,
  onComplete,
  onBack,
}: StepProps<UserPreferencesInputs>) {
  const form = useForm<UserPreferencesInputs>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      interests: data?.interests || [],
    },
  });

  const onSubmit = (values: UserPreferencesInputs) => {
    try {
      logger.info('Preferences step completed', values);
      onComplete(values);
    } catch (error) {
      logger.error('Error in preferences step', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-medium">Areas of Interest</h2>
            <p className="text-sm text-muted-foreground">
              Select the areas you're most interested in. This helps us personalize your experience.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {interests.map((interest) => (
              <FormField
                key={interest}
                control={form.control}
                name="interests"
                render={({ field }) => (
                  <FormItem className="flex items-start space-x-3 space-y-0">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value?.includes(interest)}
                        onChange={(e) => {
                          const updatedInterests = e.target.checked
                            ? [...(field.value || []), interest]
                            : field.value?.filter((i) => i !== interest) || [];
                          field.onChange(updatedInterests);
                        }}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">{interest}</FormLabel>
                  </FormItem>
                )}
              />
            ))}
          </div>
          <FormMessage />
        </div>

        <div className="flex justify-between pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
          >
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
