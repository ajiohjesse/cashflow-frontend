import { useAuthStore } from "@/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/axios";
import { queryClient } from "@/lib/react-query";
import { cn } from "@/lib/utils";
import { APIResponses } from "@/network/api-types";
import { userQuery } from "@/network/queries/user.queries";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { isAxiosError } from "axios";
import { useState } from "react";
import GoogleLogin from "./google-login";
import Spinner from "./ui/spinner";

export default function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setUser } = useAuthStore();

  const { mutate, isPending } = useMutation({
    mutationKey: ["register"],
    mutationFn: async () => {
      const { data } = await api.post<APIResponses["register"]>(
        "/v1/register",
        {
          fullName,
          email,
          password,
        },
      );
      return data;
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        setError(error.response?.data.message);
        return;
      }
      setError(error.message);
    },
    onSuccess: (response) => {
      setUser({
        accessToken: response.data.accessToken,
      });
      queryClient.setQueryData(userQuery.queryKey, {
        id: response.data.id,
        email: response.data.email,
        fullName: response.data.fullName,
        isEmailVerified: response.data.isEmailVerified,
      });
      navigate({
        to: "/overview",
        replace: true,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (isPending) return;
    if (!password || !email) {
      setError("Passwords do not match");
      return;
    }
    mutate();
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit} onChange={() => setError("")}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-xl font-bold">Sign Up to CashFlow</h1>
            <p className="text-sm">
              The easiest way to keep track of your finances.
            </p>
          </div>
          {Boolean(error) && (
            <p className="rounded border border-rose-400 bg-rose-50 px-2 py-1 text-xs text-rose-700">
              {error}
            </p>
          )}
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="e.g Jay Anthony"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="e.g jay@exampl.com"
                value={email}
                onChange={(e) => setEmail(e.target.value.trim())}
                required
              />
            </div>
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
            <Button type="submit" className="w-full">
              <Spinner loading={isPending} title="Creating your account">
                Register
              </Spinner>
            </Button>
          </div>
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              Or
            </span>
          </div>
        </div>
      </form>
      <GoogleLogin />
      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-primary underline underline-offset-4"
        >
          Sign In
        </Link>
      </div>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking Register, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
