import { ArrowRight, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { busPath, formatCount, formatINR, seatLabel } from "../../utils/format";
import { cn } from "../../utils/cn";
import AmenityList from "./AmenityList";

const MARKS = {
  "vayu-premier": "bg-forest",
  "coral-sleeper": "bg-clay",
  "quiet-cabin": "bg-[#243044]",
  "marigold-gold": "bg-[#8a5a12]",
  dayliner: "bg-canopy",
  "palm-semi": "bg-[#2f5d50]",
  hillseat: "bg-[#4d5b3a]",
  "metro-shuttle": "bg-[#3d4c5c]",
};

export default function BusCard({ bus }) {
  const seatTone = bus.seatsAvailable <= 6 ? "text-clay" : bus.seatsAvailable <= 12 ? "text-marigold-deep" : "text-canopy";
  return (
    <Link
      to={busPath(bus.id, bus)}
      className="group block rounded-3xl border border-line bg-cream p-4 transition duration-200 hover:-translate-y-0.5 hover:border-forest/25 hover:shadow-[0_18px_40px_-28px_rgba(22,56,51,0.55)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-canopy/25 sm:p-5"
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-3">
            <span className={cn("grid h-12 w-12 shrink-0 place-items-center rounded-2xl font-serif text-lg text-cream", MARKS[bus.id])}>
              {bus.name.slice(0, 1)}
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-serif text-2xl tracking-tight text-ink">{bus.name}</h2>
                {bus.badge ? (
                  <span className="rounded-full bg-marigold/15 px-2 py-0.5 text-[11px] font-semibold tracking-wide text-marigold-deep uppercase">
                    {bus.badge}
                  </span>
                ) : null}
              </div>
              <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted">
                <span className="rounded-full bg-mist px-2 py-0.5 font-medium text-forest">{bus.type}</span>
                <span className="inline-flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-marigold text-marigold" aria-hidden />
                  {bus.rating.toFixed(1)}
                  <span>· {formatCount(bus.reviews)} ratings</span>
                </span>
              </p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-[auto_1fr_auto] items-center gap-3">
            <div>
              <p className="font-serif text-xl sm:text-2xl">{bus.departure}</p>
              <p className="text-xs text-muted">{bus.from}</p>
            </div>
            <div className="px-1 text-center">
              <p className="text-xs font-medium text-muted">{bus.durationLabel}</p>
              <div className="relative mt-2 h-px overflow-hidden bg-line">
                <span className="animate-draw absolute inset-y-0 left-0 bg-marigold/80" />
                <span className="absolute top-1/2 left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-marigold" />
              </div>
            </div>
            <div className="text-right">
              <p className="font-serif text-xl sm:text-2xl">
                {bus.arrival}
                {bus.arrivalOffset ? (
                  <sup className="ml-0.5 text-xs font-sans font-semibold text-marigold-deep">+{bus.arrivalOffset}</sup>
                ) : null}
              </p>
              <p className="text-xs text-muted">{bus.to}</p>
            </div>
          </div>
          <div className="mt-4">
            <AmenityList items={bus.amenities} />
          </div>
        </div>
        <div className="flex items-end justify-between gap-4 border-t border-dashed border-line pt-4 lg:w-48 lg:flex-col lg:items-end lg:border-t-0 lg:pt-0">
          <div className="lg:text-right">
            <p className={cn("text-sm font-semibold", seatTone)}>{seatLabel(bus.seatsAvailable)}</p>
            <p className="text-xs text-muted">of {bus.seatsTotal} seats</p>
          </div>
          <div className="text-right">
            <p className="font-serif text-3xl tracking-tight text-ink">{formatINR(bus.price)}</p>
            <p className="text-xs text-muted">per seat</p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-forest">
              View seats
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
