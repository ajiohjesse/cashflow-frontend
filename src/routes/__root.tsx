import Footer from "@/components/footer";
import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { queryClient } from "@/lib/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  ErrorRouteComponent,
  Link,
  Outlet,
  createRootRoute,
  useRouter,
} from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { PostHogProvider } from "posthog-js/react";

const postHogOptions = {
  api_host: import.meta.env.VITE_POSTHOG_HOST,
};

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
  notFoundComponent: NotFoundComponent,
});

function RootLayout() {
  return (
    <PostHogProvider
      apiKey={import.meta.env.VITE_POSTHOG_KEY}
      options={postHogOptions}
    >
      <QueryClientProvider client={queryClient}>
        <Toaster />
        <TooltipProvider>
          <Outlet />
        </TooltipProvider>
        {/* <ReactQueryDevtools /> */}
      </QueryClientProvider>
    </PostHogProvider>
  );
}

function NotFoundComponent() {
  return (
    <>
      <PageHeader />
      <main className="grid h-svh place-items-center content-center gap-4 p-4">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-[clamp(4rem,20vw,9rem)] font-bold text-muted-foreground">
            {"404 :("}
          </h1>
          <p className="text-center text-muted-foreground">
            Oops! This page seems to be lost in space. Let's get you back home.
          </p>
          <Button size="lg" asChild>
            <Link to="/">
              <ArrowLeft />
              Go Back
            </Link>
          </Button>
        </div>
      </main>
      <Footer />
    </>
  );
}
