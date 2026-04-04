import { getErrorMessage } from "@/lib/errors";
import { Button } from "@repo/ui";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { ErrorBoundary } from "react-error-boundary";

export interface IAppErrorBoundaryProps {
  children: React.ReactNode;
}

interface IGenericErrorFallbackProps {
  error: unknown;
  resetErrorBoundary: () => void;
}

function GenericErrorFallback({
  error,
  resetErrorBoundary,
}: IGenericErrorFallbackProps) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6">
      <div className="mx-auto max-w-md text-center">
        <AlertCircle className="mx-auto mb-4 h-12 w-12 text-destructive" />
        <h1 className="mb-2 text-2xl font-bold">Something went wrong</h1>
        <p className="mb-6 text-muted-foreground">{getErrorMessage(error)}</p>
        <Button onClick={resetErrorBoundary}>Try Again</Button>
      </div>
    </div>
  );
}

export function AppErrorBoundary({ children }: IAppErrorBoundaryProps) {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <ErrorBoundary
      FallbackComponent={GenericErrorFallback}
      onError={(error) => console.error("Uncaught error:", error)}
      onReset={reset}
    >
      {children}
    </ErrorBoundary>
  );
}
