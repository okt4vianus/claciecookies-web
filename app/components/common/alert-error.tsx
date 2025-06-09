import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";

export function AlertError({
  title = "Errors",
  errors,
}: {
  title?: string;
  errors: string[] | undefined;
}) {
  return (
    <Alert variant="destructive">
      <AlertCircleIcon />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        <ul className="list-inside list-disc text-sm">
          {errors?.map((errorText) => (
            <li>{errorText}</li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
}
