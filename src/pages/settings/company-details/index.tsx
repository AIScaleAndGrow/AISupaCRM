import { SettingsCard } from "@/components/settings/shared/SettingsCard";
import { CompanyForm } from "@/components/settings/company/CompanyForm";
import { CompanyDetailsFormData } from "@/lib/validations/settings";
import { fetchCompanyDetails, updateCompanyDetails } from "@/lib/api/settings";
import { useCallback, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function CompanySettingsPage() {
  const [companyData, setCompanyData] = useState<CompanyDetailsFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCompanyData() {
      try {
        const data = await fetchCompanyDetails();
        setCompanyData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load company data');
      } finally {
        setIsLoading(false);
      }
    }

    loadCompanyData();
  }, []);

  const handleSubmit = useCallback(async (data: CompanyDetailsFormData) => {
    await updateCompanyDetails(data);
    setCompanyData(data);
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
      title="Company Information"
      description="Update your company details and address"
    >
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : (
        <CompanyForm
          defaultValues={companyData || {}}
          onSubmit={handleSubmit}
        />
      )}
    </SettingsCard>
  );
}
