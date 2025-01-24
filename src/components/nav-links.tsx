import { Link } from "@tanstack/react-router";
import {
  FolderOpen,
  InfoIcon,
  LayoutDashboardIcon,
  MessageSquareIcon,
  ShieldAlertIcon,
  TicketsIcon,
} from "lucide-react";

const NavLinks = () => {
  return (
    <nav>
      <NavLink to="/">
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
      <NavLink to="/privacy">
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
  return (
    <Link
      to={to}
      activeOptions={{ exact: to === "/" }}
      className="flex items-center gap-2 border-l-4 border-transparent p-4 text-sm font-medium transition-colors hover:bg-accent data-[status=active]:border-primary data-[status=active]:text-primary"
    >
      {children}
    </Link>
  );
};
