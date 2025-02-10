import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SaveButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isDirty: boolean;
  isSaving?: boolean;
  showSaved?: boolean;
}

export function SaveButton({ 
  isDirty, 
  isSaving, 
  showSaved = false,
  className, 
  ...props 
}: SaveButtonProps) {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Handle showing and hiding the success message
  useEffect(() => {
    if (showSaved) {
      setShowSuccessMessage(true);
      const timer = setTimeout(() => setShowSuccessMessage(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showSaved]);

  return (
    <div className="flex items-center gap-2">
      <Button
        type="submit"
        disabled={!isDirty || isSaving}
        className={cn("min-w-[100px]", className)}
        {...props}
      >
        {isSaving ? "Saving..." : "Save Changes"}
      </Button>
      {showSuccessMessage && (
        <span className="flex items-center text-sm text-green-600 dark:text-green-500 transition-opacity">
          <Check className="mr-1 h-4 w-4" />
          Saved
        </span>
      )}
    </div>
  );
}
