import { Check } from "lucide-react";
import { cn } from "../../utils/cn";

const STEPS = [
  { id: "trip", label: "Trip" },
  { id: "seats", label: "Seats" },
  { id: "passengers", label: "Passengers" },
  { id: "ticket", label: "Ticket" },
];

export default function Stepper({ current, tone = "dark" }) {
  const light = tone === "light";
  const activeIndex = STEPS.findIndex((step) => step.id === current);
  return (
    <ol className="no-print flex flex-wrap items-center gap-x-2 gap-y-2">
      {STEPS.map((step, index) => {
        const done = index < activeIndex;
        const active = index === activeIndex;
        return (
          <li key={step.id} className="flex items-center gap-2">
            <span
              className={cn(
                "grid h-7 w-7 place-items-center rounded-full text-xs font-semibold",
                done && "bg-marigold text-ink",
                active && (light ? "bg-white text-ink" : "bg-forest text-cream"),
                !done && !active && (light ? "bg-white/15 text-white" : "bg-paper text-muted"),
              )}
            >
              {done ? <Check className="h-3.5 w-3.5" aria-hidden /> : index + 1}
            </span>
            <span
              className={cn(
                "text-sm",
                active && "font-semibold",
                light ? (active ? "text-white" : "text-white/70") : active ? "text-ink" : "text-muted",
              )}
            >
              {step.label}
            </span>
            {index < STEPS.length - 1 ? (
              <span className={cn("mx-1 hidden h-px w-8 sm:block", light ? "bg-white/30" : "bg-line")} />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
