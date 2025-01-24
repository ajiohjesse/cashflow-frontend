import { useAuthStore } from "@/auth";
import { toast } from "@/hooks/use-toast";
import { api } from "@/lib/axios";
import { queryClient } from "@/lib/react-query";
import { APIResponses } from "@/network/api-types";
import { userQuery } from "@/network/queries/user.queries";
import { useQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  Navigate,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import { LoaderIcon } from "lucide-react";
import { usePostHog } from "posthog-js/react";

export const Route = createFileRoute("/_auth/oauth")({
  component: OauthLoading,
  validateSearch: ({ code, state }: Record<string, string>) => {
    if (!code || !state) {
      throw redirect({
        to: "/login",
      });
    }
    return {
      code,
      state,
    };
  },
});

function OauthLoading() {
  const navigate = useNavigate();
  const { code, state } = Route.useSearch();
  const posthog = usePostHog();

  const { data, error } = useQuery({
    queryKey: ["oauth", { code, state }],
    queryFn: async () => {
      return (
        await api.get<APIResponses["login"]>(
          `/v1/google/callback?code=${code}&state=${state}`,
        )
      ).data.data;
    },
    staleTime: 0,
  });

  if (error) {
    toast({
      title: "Failed to login with google",
      variant: "destructive",
    });
    posthog.capture("Google signin failed");
    navigate({
      to: "/login",
      replace: true,
    });
  }

  if (data) {
    useAuthStore.getState().setUser({
      accessToken: data.accessToken,
    });
    queryClient.setQueryData(userQuery.queryKey, {
      id: data.id,
      email: data.email,
      fullName: data.fullName,
      isEmailVerified: data.isEmailVerified,
    });
    posthog.identify(data.id, { ...data });
    return <Navigate to="/overview" />;
  }

  return (
    <main>
      <div className="grid place-items-center gap-4 p-4">
        <div className="flex flex-col items-center gap-4">
          <LoaderIcon className="size-12 animate-spin text-primary duration-1000" />
          <p className="text-lg font-semibold text-muted-foreground">
            Signing In, Please wait. . .
          </p>
        </div>
      </div>
    </main>
  );
}
