import ResetPasswordForm from "@/components/reset-password-form";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/reset-password")({
  component: RouteComponent,
  validateSearch: (search: Record<string, string>) => {
    return {
      token: search.token,
    };
  },

  beforeLoad: ({ search }) => {
    if (!search.token) {
      throw redirect({
        to: "/",
      });
    }
  },
});

function RouteComponent() {
  const { token } = Route.useSearch();

  return <ResetPasswordForm token={token} />;
}
