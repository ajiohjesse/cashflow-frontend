import { Link } from "@tanstack/react-router";

const Footer = () => {
  return (
    <footer className="flex flex-col items-center gap-4 bg-muted px-8 py-4 text-center text-sm font-medium md:flex-row md:justify-between">
      <p className="text-muted-foreground">
        Copyright © {new Date().getFullYear()} R3HX. All rights reserved.
      </p>

      <div className="flex gap-4">
        <Link
          className="font-medium text-primary underline underline-offset-2 hover:underline-offset-4"
          to="/terms-of-use"
        >
          Terms Of Use
        </Link>
        <Link
          className="font-medium text-primary underline underline-offset-2 hover:underline-offset-4"
          to="/privacy-policy"
        >
          Privacy Policy
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
