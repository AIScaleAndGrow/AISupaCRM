import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { StepProps, ConfirmationInputs } from '../types';
import { logger } from '@/utils/logger';

const formSchema = z.object({
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
  marketingConsent: z.boolean().optional(),
});

export default function ConfirmationStep({
  data,
  onComplete,
  onBack,
}: StepProps<ConfirmationInputs>) {
  const navigate = useNavigate();
  
  const form = useForm<ConfirmationInputs>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      termsAccepted: data?.termsAccepted || false,
      marketingConsent: data?.marketingConsent || false,
    },
  });

  const onSubmit = async (values: ConfirmationInputs) => {
    try {
      logger.info('Processing confirmation step', values);
      await onComplete(values);
    } catch (error) {
      logger.error('Error in confirmation step', error);
      // Show error message to user
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <div className="space-y-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold">Almost Done!</h2>
            <p className="text-muted-foreground mt-2">
              Please review and accept the terms to complete your registration
            </p>
          </div>

          <FormField
            control={form.control}
            name="termsAccepted"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    I accept the{' '}
                    <a
                      href="/terms"
                      className="text-primary hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      terms and conditions
                    </a>
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="marketingConsent"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    I agree to receive marketing communications
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />
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
            Complete Registration
          </Button>
        </div>
      </form>
    </Form>
  );
}
