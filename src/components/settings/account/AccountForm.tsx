import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSettingsForm } from "@/hooks/settings/useSettingsForm";
import { UserAccountFormData, userAccountSchema } from "@/lib/validations/settings";
import { useSettingsStore } from "@/store/settingsStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { uploadProfilePicture } from "@/lib/api/settings";
import { SaveButton } from "../shared/SaveButton";

interface AccountFormProps {
  defaultValues: Partial<UserAccountFormData>;
  onSubmit: (data: UserAccountFormData) => Promise<void>;
}

export function AccountForm({ defaultValues, onSubmit }: AccountFormProps) {
  const { isLoading, setLoading, setError } = useSettingsStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const form = useSettingsForm(userAccountSchema, {
    defaultValues,
  });

  async function handleSubmit(data: UserAccountFormData) {
    try {
      setLoading(true);
      await onSubmit(data);
      form.reset(data); // Reset form with new values to clear dirty state
      toast.success("Account settings updated successfully");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to update account");
      toast.error("Failed to update account");
    } finally {
      setLoading(false);
    }
  }

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Resize image if needed
    const resizeImage = async (file: File): Promise<Blob> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Max dimensions
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            if (blob) resolve(blob);
          }, file.type);
        };
        img.src = URL.createObjectURL(file);
      });
    };

    try {
      setLoading(true);
      const resizedImage = await resizeImage(file);
      const { url } = await uploadProfilePicture(new File([resizedImage], file.name, { type: file.type }));
      form.setValue("picture", url);
      toast.success("Profile picture updated successfully");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to upload profile picture");
      toast.error("Failed to upload profile picture");
      setImagePreview(null);
    } finally {
      setLoading(false);
    }
  }, [form, setLoading, setError]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="picture"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile Picture</FormLabel>
              <FormControl>
                <div className="flex items-center gap-4">
                  <div className="relative h-24 w-24 overflow-hidden rounded-full">
                    <img
                      src={imagePreview || defaultValues.picture || "/placeholder-avatar.png"}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <Button 
                    variant="outline" 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                  >
                    Change Picture
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                  <Input {...field} disabled />
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
                    country="us"
                    value={field.value}
                    onChange={(phone) => field.onChange("+" + phone)}
                    inputClass="!w-full !h-10 !text-base"
                    buttonClass="!h-10"
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
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <SaveButton isDirty={form.formState.isDirty} isSaving={isLoading} />
      </form>
    </Form>
  );
}
