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

export default function ForgotPasswordForm() {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const posthog = usePostHog();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const { mutate, isPending } = useMutation({
    mutationKey: ["forgot-password"],
    mutationFn: async () => {
      const { data } = await api.post("/v1/forgot-password", {
        email,
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
      setEmail("");
      setDialogOpen(true);
      posthog.capture("Forgot password request", { email: email });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (isPending) return;
    if (!email) {
      setError("Please enter your email");
      return;
    }

    mutate();
  };

  return (
    <div className={cn("flex flex-col gap-6")}>
      <form onSubmit={handleSubmit} onChange={() => setError("")}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-xl font-bold">Request for Password Reset</h1>
            <p className="text-sm">
              We'll send a reset link to your registered email address.
            </p>
          </div>
          {Boolean(error) && (
            <p className="rounded border border-rose-400 bg-rose-50 px-2 py-1 text-xs text-rose-700">
              {error}
            </p>
          )}
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value.trim())}
                required
              />
            </div>

            <Button type="submit" className="w-full">
              <Spinner
                loading={isPending}
                title="Requesting for password reset"
              >
                Send Reset Link
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
              We've sent you a reset link. Check you email for further
              instructions. Note that this link will expire after 24 hours.
            </p>
            <Button asChild>
              <Link to="/">
                Continue
                <LogInIcon className="size-5" />
              </Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
