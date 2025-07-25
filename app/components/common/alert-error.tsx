import { AlertCircleIcon } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";

export function AlertError({
  errors,
}: {
  title?: string;
  errors: string[] | undefined;
}) {
  return (
    <Alert variant="destructive">
      <AlertCircleIcon />
      <AlertDescription>
        <ul className="text-sm">
          {errors?.map((errorText) => (
            <li key={errorText}>{errorText}</li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
}

export function AlertErrorSimple({
  errors,
}: {
  title?: string;
  errors: string[] | undefined;
}) {
  return (
    <Alert variant="destructive" className="px-2 py-1">
      <AlertDescription>
        <ul className="text-xs">
          {errors?.map((errorText) => (
            <li key={errorText}>{errorText}</li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
}
