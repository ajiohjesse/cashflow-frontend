import { Link } from "@tanstack/react-router";
import {
  FolderOpen,
  InfoIcon,
  LayoutDashboardIcon,
  MessageSquareIcon,
  ShieldAlertIcon,
  TicketsIcon,
  TrashIcon,
} from "lucide-react";
import { useVitePostHog } from "vite-plugin-posthog/react";

const NavLinks = () => {
  return (
    <nav>
      <NavLink to="/overview">
        <LayoutDashboardIcon className="size-5" />
        Overview
      </NavLink>
      <NavLink to="/transactions">
        <TicketsIcon className="size-5" />
        Transactions
      </NavLink>
      <NavLink to="/categories">
        <FolderOpen className="size-5" />
        Categories
      </NavLink>

      <div className="mx-auto my-8 h-px w-[90%] bg-border"></div>

      <NavLink to="/terms-of-use">
        <InfoIcon className="size-5" />
        Terms Of Use
      </NavLink>
      <NavLink to="/privacy-policy">
        <ShieldAlertIcon className="size-5" />
        Privacy Policy
      </NavLink>
      <a
        href="mailto:me@rehx.name.ng"
        className="flex items-center gap-2 border-l-4 border-transparent p-4 text-sm font-medium transition-colors hover:bg-accent"
      >
        <MessageSquareIcon className="size-5" />
        Contact Us
      </a>

      <div className="mx-auto my-8 h-px w-[90%] bg-border"></div>

      <a
        className="flex items-center gap-2 border-l-4 border-transparent p-4 text-sm font-medium text-rose-600 transition-colors hover:bg-accent"
        href="mailto:me@rehx.name.ng?subject=Account Deletion Request&body=Hello,%0D%0A%0D%0AI am writing to request the deletion of my account and the removal of all my personal data from the CashFlow application.%0D%0A%0D%0APlease confirm once the process is complete.%0D%0A%0D%0AThank you."
      >
        <TrashIcon className="size-5" />
        Account Deletion
      </a>
    </nav>
  );
};

export default NavLinks;

const NavLink = ({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) => {
  const posthog = useVitePostHog();

  return (
    <Link
      to={to}
      onClick={() => posthog?.capture("Clicked nav link", { href: to })}
      activeOptions={{ exact: to === "/" }}
      className="flex items-center gap-2 border-l-4 border-transparent p-4 text-sm font-medium transition-colors hover:bg-accent data-[status=active]:border-primary data-[status=active]:text-primary"
    >
      {children}
    </Link>
  );
};
