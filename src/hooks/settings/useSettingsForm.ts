import { useForm, UseFormProps } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export function useSettingsForm<T extends z.ZodType>(
  schema: T,
  options: Omit<UseFormProps<z.infer<T>>, "resolver"> = {}
) {
  return useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    mode: "onChange",
    ...options,
  });
}
