import { SettingsCard } from "@/components/settings/shared/SettingsCard";
import { AccountForm } from "@/components/settings/account/AccountForm";
import { UserAccountFormData } from "@/lib/validations/settings";
import { fetchUserAccount, updateUserAccount } from "@/lib/api/settings";
import { useCallback, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AccountSettingsPage() {
  const [userData, setUserData] = useState<UserAccountFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUserData() {
      try {
        const data = await fetchUserAccount();
        setUserData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load user data');
      } finally {
        setIsLoading(false);
      }
    }

    loadUserData();
  }, []);

  const handleSubmit = useCallback(async (data: UserAccountFormData) => {
    await updateUserAccount(data);
    setUserData(data);
  }, []);

  if (error) {
    return (
      <div className="rounded-lg border border-destructive p-4">
        <p className="text-destructive">Error: {error}</p>
      </div>
    );
  }

  return (
    <SettingsCard
      title="Personal Information"
      description="Update your personal information and contact details"
    >
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : (
        <AccountForm
          defaultValues={userData || {}}
          onSubmit={handleSubmit}
        />
      )}
    </SettingsCard>
  );
}
