import { Link } from "@tanstack/react-router";
import { GalleryVerticalEnd } from "lucide-react";
import GradientText from "./gradient-text";

const Logo = () => {
  return (
    <Link
      to="/"
      className="flex items-start gap-1 text-xl font-black text-primary"
    >
      <GalleryVerticalEnd className="size-6" />
      <GradientText>CashFlow.</GradientText>
    </Link>
  );
};

export default Logo;
