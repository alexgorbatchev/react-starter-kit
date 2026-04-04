import { AuthForm } from "@/components/auth";
import { revalidateSession } from "@/lib/queries/session";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";

export interface ILoginPageProps {
  returnTo?: string;
}

export function LoginPage({ returnTo }: ILoginPageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  async function handleSuccess(): Promise<void> {
    await revalidateSession(queryClient, router);
    await router.navigate({ to: returnTo ?? "/" });
  }

  return (
    <div
      className="flex min-h-svh flex-col items-center justify-center bg-muted/40 p-6 md:p-10"
      data-testid="LoginPage"
    >
      <div className="w-full max-w-sm rounded-xl bg-background p-8 shadow-sm ring-1 ring-border/50">
        <AuthForm mode="login" onSuccess={handleSuccess} returnTo={returnTo} />
      </div>
    </div>
  );
}
