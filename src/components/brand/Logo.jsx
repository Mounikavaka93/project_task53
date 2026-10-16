import { Link } from "react-router-dom";
import { cn } from "../../utils/cn";

export default function Logo({ light = false, className = "" }) {
  return (
    <Link to="/" className={cn("inline-flex items-center gap-2.5", className)} aria-label="Cedarline home">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-forest text-marigold">
        <svg viewBox="0 0 32 32" className="h-6 w-6" aria-hidden="true">
          <path
            d="M5 21h22M8 21v-4.4A6 6 0 0 1 14 11h4a6 6 0 0 1 6 5.6V21"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="11.5" cy="22.5" r="1.5" fill="#f3eee4" />
          <circle cx="20.5" cy="22.5" r="1.5" fill="#f3eee4" />
        </svg>
      </span>
      <span className={cn("font-serif text-xl tracking-tight", light ? "text-cream" : "text-ink")}>Cedarline</span>
    </Link>
  );
}
