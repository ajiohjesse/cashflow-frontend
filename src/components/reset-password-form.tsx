import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/axios";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { isAxiosError } from "axios";
import { CheckCircle, LogInIcon } from "lucide-react";
import { usePostHog } from "posthog-js/react";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import Spinner from "./ui/spinner";

interface Props {
  token: string;
}

export default function ResetPasswordForm(props: Props) {
  const { token } = props;
  const posthog = usePostHog();
  const [isDialogOpen, setDialogOpen] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const { mutate, isPending } = useMutation({
    mutationKey: ["reset-password"],
    mutationFn: async () => {
      const { data } = await api.post("/v1/reset-password", {
        password,
        token,
      });
      return data;
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        setError(error.response?.data.message);
        return;
      }
      setError(error.message);
    },
    onSuccess: () => {
      setPassword("");
      setConfirmPassword("");
      setDialogOpen(true);
      posthog.capture("Reset password completed");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (isPending) return;
    if (!password || !confirmPassword) {
      setError("All fields are required");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    mutate();
  };

  return (
    <div className={cn("flex flex-col gap-6")}>
      <form onSubmit={handleSubmit} onChange={() => setError("")}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-xl font-bold">Reset Your Password</h1>
            <p className="text-sm">
              Let's help you regain access to your account.
            </p>
          </div>
          {Boolean(error) && (
            <p className="rounded border border-rose-400 bg-rose-50 px-2 py-1 text-xs text-rose-700">
              {error}
            </p>
          )}
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value.trim())}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Retype your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value.trim())}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              <Spinner loading={isPending} title="Resetting your password">
                Reset Password
              </Spinner>
            </Button>
          </div>
        </div>
      </form>
      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger></DialogTrigger>
        <DialogContent>
          <div className="grid place-items-center gap-4 pt-4">
            <CheckCircle className="size-24 text-emerald-600" />
            <p className="py-4 text-center font-medium">
              Your password has been reset successfully. You can now login with
              your new password.
            </p>
            <Button asChild>
              <Link to="/login">
                Proceed to Login
                <LogInIcon className="size-5" />
              </Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
