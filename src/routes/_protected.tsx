import { useAuthStore } from "@/auth";
import Header from "@/components/header";
import NavLinks from "@/components/nav-links";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected")({
  beforeLoad: () => {
    const user = useAuthStore.getState().user;
    if (!user) {
      throw redirect({
        to: "/login",
      });
    }
  },
  component: ProtectedLayout,
});

function ProtectedLayout() {
  return (
    <>
      <Header />

      <div className="grid min-[1024px]:grid-cols-[240px_1fr]">
        <aside className="fixed -left-[240px] top-16 z-50 h-[calc(100dvh-64px)] w-[240px] overflow-y-auto border-r bg-white py-4 min-[1024px]:sticky">
          <NavLinks />
        </aside>

        <main>
          <Outlet />
        </main>
      </div>
    </>
  );
}
