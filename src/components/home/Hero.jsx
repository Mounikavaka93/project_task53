import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBooking } from "../../context/BookingContext";
import { searchPath, tomorrowISO } from "../../utils/format";
import SearchPanel from "../search/SearchPanel";

export default function Hero() {
  const navigate = useNavigate();
  const { startSearch } = useBooking();
  const [trip, setTrip] = useState({ from: "", to: "", date: tomorrowISO() });

  return (
    <section className="relative isolate -mt-[4.5rem]">
      <div className="relative min-h-[40rem] overflow-hidden text-cream sm:min-h-[44rem]">
        <img
          src="/bus-hero.jpg"
          alt=""
          className="animate-kenburns absolute inset-0 h-full w-full object-cover object-[center_42%]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/40 to-black/80" />
        <div className="relative mx-auto grid max-w-6xl items-end gap-10 px-4 pt-32 pb-40 sm:px-6 sm:pt-36 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <div className="animate-rise min-w-0">
            <p className="text-xs font-semibold tracking-[0.18em] text-marigold uppercase">Night coaches, day seats</p>
            <h1 className="mt-4 max-w-xl font-serif text-4xl leading-[1.08] tracking-tight text-balance sm:text-6xl">
              The highway is open. Your seat is not a guess.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-white/80 sm:text-lg">
              Compare coaches on the route, see which berths are free, and leave with a PNR before the depot lights
              come on.
            </p>
          </div>
          <div className="animate-rise hidden md:block" style={{ animationDelay: "120ms" }}>
            <PreviewTicket />
          </div>
        </div>
      </div>
      <div className="relative z-20 mx-auto -mt-28 max-w-6xl px-4 sm:px-6">
        <SearchPanel
          value={trip}
          onChange={(patch) => setTrip((current) => ({ ...current, ...patch }))}
          onSubmit={(next) => {
            startSearch(next);
            navigate(searchPath(next));
          }}
        />
      </div>
    </section>
  );
}

function PreviewTicket() {
  return (
    <div className="animate-float rounded-[1.75rem] border border-white/25 bg-black/35 p-5 shadow-2xl backdrop-blur-md" aria-hidden="true">
      <div className="flex items-center justify-between text-xs tracking-[0.14em] text-marigold uppercase">
        <span>On board tonight</span>
        <span>CL48K2</span>
      </div>
      <p className="mt-4 font-serif text-3xl">Mumbai to Pune</p>
      <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
        <div>
          <p className="text-white/60">Departs</p>
          <p className="mt-1 font-serif text-2xl">21:10</p>
        </div>
        <div className="text-center">
          <p className="text-white/60">Coach</p>
          <p className="mt-1 font-medium">Vayu Premier</p>
        </div>
        <div className="text-right">
          <p className="text-white/60">Berth</p>
          <p className="mt-1 font-serif text-2xl">L4W</p>
        </div>
      </div>
      <div className="mt-5 h-px bg-white/20" />
      <p className="mt-4 text-sm text-white/75">AC sleeper · lower deck · window</p>
    </div>
  );
}
