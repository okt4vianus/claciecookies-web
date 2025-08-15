import { useEffect } from "react";
import { toast } from "sonner";

export function useToast(toastMessage?: string) {
  useEffect(() => {
    if (toastMessage) {
      toast.success(toastMessage);
    }
  }, [toastMessage]);
}
