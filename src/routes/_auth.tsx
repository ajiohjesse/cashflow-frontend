import banner from "@/assets/banner2.png";
import { useAuthStore } from "@/auth";
import Logo from "@/components/logo";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
  component: RouteComponent,
  beforeLoad: () => {
    if (useAuthStore.getState().user) {
      throw redirect({
        to: "/overview",
      });
    }
  },
});

function RouteComponent() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Logo />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <Outlet />
          </div>
        </div>
      </div>
      <div className="relative hidden lg:block">
        <img
          src={banner}
          alt="Image"
          className="absolute inset-0 h-full w-full object-contain dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
