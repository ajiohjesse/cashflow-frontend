import ForgotPasswordForm from "@/components/forgot-password-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/forgot-password")({
  component: ForgotPasswordForm,
});
