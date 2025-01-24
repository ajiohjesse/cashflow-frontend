/**
 * should accepts a loading prop
 * should accept an optional children prop that is displayed when not loading
 * should display a loading spinner when loading
 * should maintain the size of the children when loading
 */

import { cn } from "@/lib/utils";
import { LoaderCircleIcon } from "lucide-react";

interface SpinnerProps {
  loading: boolean;
  title: string;
  children: React.ReactNode;
  className?: string;
  spinnerClassName?: string;
  childrenClassName?: string;
}

const Spinner = ({
  loading,
  title,
  children,
  className,
  spinnerClassName,
  childrenClassName,
}: SpinnerProps) => {
  return (
    <span className={cn("relative w-max", className)}>
      {loading && (
        <span className="absolute inset-0 grid place-items-center">
          <LoaderCircleIcon
            className={cn(
              "size-4 animate-spin duration-1000 will-change-transform",
              spinnerClassName,
            )}
          />
          <span className="sr-only">{title}</span>
        </span>
      )}
      <span
        className={cn(loading ? "invisible" : "visible", childrenClassName)}
      >
        {children}
      </span>
    </span>
  );
};

export default Spinner;
