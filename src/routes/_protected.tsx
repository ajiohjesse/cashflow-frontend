import { useAuthStore } from "@/auth";
import Header from "@/components/header";
import NavLinks from "@/components/nav-links";
import useClickOutside from "@/hooks/use-click-outside";
import { cn } from "@/lib/utils";
import { useNavStore } from "@/stores/stores";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { useRef } from "react";

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
  const { isOpen, setIsOpen } = useNavStore();
  const navRef = useRef(null);
  useClickOutside(
    navRef,
    () => {
      if (isOpen) {
        setIsOpen(false);
      }
    },
    [],
    ["nav-toggle"],
  );

  return (
    <>
      <Header />

      <div className="grid min-[1024px]:grid-cols-[240px_1fr]">
        <aside
          ref={navRef}
          style={{
            transition: "left 300ms ease-out",
          }}
          className={cn(
            "fixed top-16 z-50 h-[calc(100dvh-64px)] w-[240px] overflow-y-auto border-r bg-white py-4 min-[1024px]:sticky",
            isOpen ? "left-0" : "-left-[240px]",
          )}
        >
          <NavLinks />
        </aside>

        <main>
          <Outlet />
        </main>
      </div>
    </>
  );
}
