import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSettingsForm } from "@/hooks/settings/useSettingsForm";
import { AVAILABLE_INDUSTRIES, AVAILABLE_COMPANY_SIZES, CompanyDetailsFormData, companyDetailsSchema } from "@/lib/validations/settings";
import { useSettingsStore } from "@/store/settingsStore";
import { useCallback, useState, useEffect } from "react";
import { toast } from "sonner";
import GoogleAddressAutocomplete from "@/components/ui/GoogleAddressAutocomplete";
import { SaveButton } from "../shared/SaveButton";

interface CompanyFormProps {
  defaultValues: Partial<CompanyDetailsFormData>;
  onSubmit: (data: CompanyDetailsFormData) => Promise<void>;
}

export function CompanyForm({ defaultValues, onSubmit }: CompanyFormProps) {
  const { isLoading, setLoading, setError } = useSettingsStore();
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const form = useSettingsForm(companyDetailsSchema, {
    defaultValues: {
      ...defaultValues,
      address: defaultValues.address || {
        formattedAddress: "",
        street: "",
        suburb: "",
        state: "",
        country: "",
        zipCode: "",
      },
    },
  });

  const handleSubmit = useCallback(async (data: CompanyDetailsFormData) => {
    try {
      setLoading(true);
      await onSubmit(data);
      setSaveSuccess(true); // Set success state after successful save
      form.reset(data); // Reset form with new values to clear dirty state
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to update company settings");
      toast.error("Failed to update company settings");
      setSaveSuccess(false);
    } finally {
      setLoading(false);
    }
  }, [onSubmit, setLoading, setError, form]);

  useEffect(() => {
    if (form.formState.isDirty) {
      setSaveSuccess(false);
    }
  }, [form.formState.isDirty]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                  <Input {...field} type="url" placeholder="https://" />
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
                    <SelectTrigger>
                      <SelectValue placeholder="Select an industry" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {AVAILABLE_INDUSTRIES.map((industry) => (
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
                    <SelectTrigger>
                      <SelectValue placeholder="Select company size" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {AVAILABLE_COMPANY_SIZES.map((size) => (
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

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <GoogleAddressAutocomplete
                    value={field.value.formattedAddress}
                    onChange={(value) => {
                      form.setValue("address.formattedAddress", value, { shouldDirty: true });
                    }}
                    onAddressSelect={(addressData) => {
                      form.setValue("address", addressData, { shouldDirty: true });
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <SaveButton 
          isDirty={form.formState.isDirty} 
          isSaving={isLoading}
          showSaved={saveSuccess}
        />
      </form>
    </Form>
  );
}
