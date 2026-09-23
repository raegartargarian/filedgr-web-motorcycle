import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface LogoProps {
  className?: string;
  /** Wrap in a link to the home route (default) or render inline. */
  asLink?: boolean;
}

/** The Dealership mark from public/logo.svg with the wordmark beside it. */
export const Logo = ({ className, asLink = true }: LogoProps) => {
  const content = (
    <>
      <img src="/logo.svg" alt="" className="h-6 w-6" />
      <span className="text-lg font-medium tracking-wide text-glow-50">
        Dealership
      </span>
    </>
  );
  const classes = cn("flex items-center gap-2.5", className);

  return asLink ? (
    <Link to="/" className={classes}>
      {content}
    </Link>
  ) : (
    <span className={classes}>{content}</span>
  );
};
