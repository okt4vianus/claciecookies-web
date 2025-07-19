import { cn } from "@/lib/utils";

/**
 * Debug Code
 *
 * Preformat code component to show debugging information.
 */

export function DebugCode({
  children,
  className,
}: {
  children?: string | object;
  className?: string;
}) {
  return (
    <div>
      <pre
        className={cn(
          "max-h-96 max-w-md text-xs",
          "break-spaces my-1 overflow-scroll rounded-xl border border-surface-200 bg-white p-1 dark:border-surface-800 dark:bg-black",
          className,
        )}
      >
        <code>{JSON.stringify(children, null, 2)}</code>
      </pre>
    </div>
  );
}
