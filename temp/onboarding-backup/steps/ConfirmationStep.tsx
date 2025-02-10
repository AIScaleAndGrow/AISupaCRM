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
import { StepProps } from '../types';
import { logger } from '@/utils/logger';

interface ConfirmationInputs {
  termsAccepted: boolean;
  marketingConsent: boolean;
}

const formSchema = z.object({
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
  marketingConsent: z.boolean(),
});

const ConfirmationStep: React.FC<StepProps<ConfirmationInputs>> = ({
  onComplete,
  onBack,
  savedData,
}) => {
  const navigate = useNavigate();

  const form = useForm<ConfirmationInputs>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      termsAccepted: savedData?.steps?.confirmation?.termsAccepted || false,
      marketingConsent: savedData?.steps?.confirmation?.marketingConsent || false,
    },
  });

  const onSubmit = async (data: ConfirmationInputs) => {
    try {
      logger.info('Submitting confirmation step', { data });
      onComplete(data);
    } catch (error) {
      logger.error('Error submitting confirmation step', error);
      // Handle error
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Almost Done!</h2>
          <p className="text-gray-600">Please review and confirm your choices</p>

          {/* Display summary of previous steps */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <div>
              <h3 className="font-medium">User Information</h3>
              <p className="text-sm text-gray-600">
                {savedData?.steps?.userInfo?.fullName} ({savedData?.steps?.userInfo?.email})
              </p>
            </div>
            <div>
              <h3 className="font-medium">Preferences</h3>
              <p className="text-sm text-gray-600">
                Role: {savedData?.steps?.preferences?.role}
              </p>
            </div>
            <div>
              <h3 className="font-medium">Company Details</h3>
              <p className="text-sm text-gray-600">
                {savedData?.steps?.companyDetails?.companyName}
              </p>
            </div>
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
                    I accept the terms and conditions
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
            Complete Setup
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ConfirmationStep;
