import { Link } from "react-router-dom";
import { cn } from "../../utils/cn";

const styles = {
  primary:
    "bg-marigold text-forest shadow-[0_12px_24px_-14px_rgba(197,110,20,0.9)] hover:-translate-y-0.5 hover:bg-marigold-deep hover:text-cream",
  forest: "bg-forest text-cream hover:-translate-y-0.5 hover:bg-canopy",
  outline: "border border-line bg-cream text-ink hover:border-forest hover:bg-mist",
  ghost: "bg-transparent text-ink hover:bg-mist",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-canopy/25 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0";

export default function Button({ variant = "primary", className = "", type = "button", ...props }) {
  return <button type={type} className={cn(base, styles[variant], className)} {...props} />;
}

export function LinkButton({ to, variant = "primary", className = "", children }) {
  return (
    <Link to={to} className={cn(base, styles[variant], className)}>
      {children}
    </Link>
  );
}
