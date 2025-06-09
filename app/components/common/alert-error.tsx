import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";

export function AlertError({ errors }: { errors: string[] | undefined }) {
  return (
    <Alert variant="destructive">
      <AlertCircleIcon />
      <AlertDescription>
        <ul className="text-sm">
          {errors?.map((errorText) => (
            <li>{errorText}</li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
}

export function AlertErrorSimple({ errors }: { errors: string[] | undefined }) {
  return (
    <Alert variant="destructive" className="px-2 py-1">
      <AlertDescription>
        <ul className="text-xs">
          {errors?.map((errorText) => (
            <li>{errorText}</li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
}
