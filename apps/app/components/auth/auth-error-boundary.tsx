import { isUnauthenticatedError } from "@/lib/errors";
import { sessionQueryKey } from "@/lib/queries/session";
import { Button } from "@repo/ui";
import {
  useQueryClient,
  useQueryErrorResetBoundary,
} from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { ErrorBoundary } from "react-error-boundary";

interface IResetProps {
  resetErrorBoundary: () => void;
}

// Fallback for auth errors in protected routes
function AuthErrorFallback({ resetErrorBoundary }: IResetProps) {
  const queryClient = useQueryClient();

  const handleRetry = () => {
    queryClient.resetQueries({ queryKey: sessionQueryKey });
    resetErrorBoundary();
  };

  const handleSignIn = () => {
    queryClient.removeQueries({ queryKey: sessionQueryKey });
    const { pathname, search, hash } = window.location;
    const returnTo = encodeURIComponent(pathname + search + hash);
    window.location.href = `/login?returnTo=${returnTo}`;
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6">
      <div className="mx-auto max-w-md text-center">
        <AlertCircle className="mx-auto mb-4 h-12 w-12 text-destructive" />
        <h1 className="mb-2 text-2xl font-bold">Authentication Required</h1>
        <p className="mb-6 text-muted-foreground">
          Please sign in to access this page.
        </p>
        <div className="flex justify-center gap-3">
          <Button variant="outline" onClick={handleRetry}>
            Try Again
          </Button>
          <Button onClick={handleSignIn}>Sign In</Button>
        </div>
      </div>
    </div>
  );
}

interface IErrorFallbackProps {
  error: unknown;
  resetErrorBoundary: () => void;
}

interface IErrorBoundaryProps {
  children: React.ReactNode;
}

// Routes auth errors to AuthErrorFallback, others to GenericErrorFallback
function AuthAwareErrorFallback({
  error,
  resetErrorBoundary,
}: IErrorFallbackProps) {
  if (!isUnauthenticatedError(error)) {
    throw error;
  }

  return <AuthErrorFallback resetErrorBoundary={resetErrorBoundary} />;
}

// Auth error boundary for protected routes only.
// Catches auth errors (tRPC UNAUTHORIZED or HTTP 401) and shows recovery UI.
// 403 (forbidden) falls through to generic handler since user IS authenticated.
export function AuthErrorBoundary({ children }: IErrorBoundaryProps) {
  const queryClient = useQueryClient();
  const { reset } = useQueryErrorResetBoundary();

  return (
    <ErrorBoundary
      FallbackComponent={AuthAwareErrorFallback}
      onReset={reset}
      onError={(error) => {
        console.error("Error caught by boundary:", error);
        if (isUnauthenticatedError(error)) {
          queryClient.removeQueries({ queryKey: sessionQueryKey });
        }
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
