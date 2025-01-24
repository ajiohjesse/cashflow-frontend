import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { queryClient } from "@/lib/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  ErrorRouteComponent,
  Outlet,
  createRootRoute,
  useRouter,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

const ErrorBoundary: ErrorRouteComponent = ({ error, reset }) => {
  const router = useRouter();

  return (
    <div className="grid h-svh place-items-center content-center gap-4 p-4">
      {error.message}
      <Button
        onClick={() => {
          router.invalidate();
          reset();
        }}
      >
        retry
      </Button>
    </div>
  );
};

export const Route = createRootRoute({
  component: RootLayout,
  errorComponent: ErrorBoundary,
});

function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <TooltipProvider>
        <Outlet />
        <TanStackRouterDevtools />
      </TooltipProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
