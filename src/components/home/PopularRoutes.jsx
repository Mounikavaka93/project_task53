import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useBooking } from "../../context/BookingContext";
import { getBuses, POPULAR_ROUTES } from "../../data/fleet";
import { formatINR, searchPath, tomorrowISO } from "../../utils/format";
import Reveal from "../ui/Reveal";

export default function PopularRoutes() {
  const navigate = useNavigate();
  const { startSearch } = useBooking();
  const date = tomorrowISO();

  return (
    <section id="routes" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <Reveal>
        <p className="text-xs font-semibold tracking-[0.16em] text-canopy uppercase">Corridors</p>
        <h2 className="mt-2 font-serif text-3xl tracking-tight sm:text-4xl">Routes people book often</h2>
      </Reveal>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {POPULAR_ROUTES.map(([from, to], index) => {
          const buses = getBuses(from, to, date);
          const cheapest = buses.reduce((best, bus) => (bus.price < best.price ? bus : best), buses[0]);
          const fastest = buses.reduce((best, bus) => (bus.durationMin < best.durationMin ? bus : best), buses[0]);
          return (
            <Reveal key={`${from}-${to}`} delay={index * 60}>
              <button
                type="button"
                onClick={() => {
                  const trip = { from, to, date };
                  startSearch(trip);
                  navigate(searchPath(trip));
                }}
                className="group flex h-full w-full flex-col rounded-3xl border border-line bg-cream p-5 text-left transition hover:-translate-y-0.5 hover:border-forest/30 hover:shadow-[0_16px_36px_-28px_rgba(22,56,51,0.6)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-muted">{from}</p>
                    <p className="font-serif text-2xl tracking-tight">to {to}</p>
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-canopy transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
                <p className="mt-6 text-sm text-muted">Fastest {fastest.durationLabel}</p>
                <p className="mt-1 text-sm font-semibold text-forest">From {formatINR(cheapest.price)}</p>
              </button>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
