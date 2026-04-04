import { getSafeRedirectUrl } from "@/lib/auth-config";
import { revalidateSession } from "@/lib/queries/session";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@repo/ui";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter, useRouterState } from "@tanstack/react-router";
import { AuthForm } from "./auth-form";

interface ILoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Login dialog component for modal authentication.
 */
export function LoginDialog({ open, onOpenChange }: ILoginDialogProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Preserve full URL (pathname + search + hash) for OAuth redirect
  const returnTo = useRouterState({
    select: (s) => {
      const { pathname, search, hash } = s.location;
      return getSafeRedirectUrl(pathname + search + hash);
    },
  });

  async function handleSuccess() {
    await revalidateSession(queryClient, router);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="sr-only">
          <DialogTitle>Sign in to your account</DialogTitle>
          <DialogDescription>
            Choose your preferred sign in method
          </DialogDescription>
        </DialogHeader>
        <AuthForm mode="login" onSuccess={handleSuccess} returnTo={returnTo} />
      </DialogContent>
    </Dialog>
  );
}
