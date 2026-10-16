import { BusFront } from "lucide-react";
import { useState } from "react";
import { flattenSeats, seatPlan } from "../../data/fleet";
import { cn } from "../../utils/cn";

export const MAX_SEATS = 6;

export default function SeatMap({ layout, booked, selected, onToggle }) {
  const decks = seatPlan(layout);
  const [deckName, setDeckName] = useState(decks[0].name);
  const deck = decks.find((item) => item.name === deckName) || decks[0];
  const bookedSet = new Set(booked);
  const berth = layout === "sleeper";

  return (
    <div className="rounded-[1.75rem] border border-line bg-[#f7f1e6] p-4 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="inline-flex items-center gap-2 text-sm text-muted">
          <BusFront className="h-5 w-5 text-forest" aria-hidden />
          Front of the coach
        </p>
        <p className="text-xs tracking-wide text-muted uppercase">
          {berth ? "Window and aisle berths" : "Aisle in the middle"}
        </p>
      </div>
      {decks.length > 1 ? (
        <div role="tablist" aria-label="Deck" className="mb-4 flex gap-2">
          {decks.map((item) => {
            const ids = flattenSeats([item]).map((seat) => seat.id);
            const picked = ids.filter((id) => selected.includes(id)).length;
            return (
              <button
                key={item.name}
                type="button"
                role="tab"
                aria-selected={item.name === deck.name}
                onClick={() => setDeckName(item.name)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold transition",
                  item.name === deck.name ? "bg-forest text-cream" : "bg-cream text-muted hover:text-ink",
                )}
              >
                {item.name}
                {picked ? ` · ${picked}` : ""}
              </button>
            );
          })}
        </div>
      ) : null}
      <div className="mx-auto max-w-md space-y-2" role="group" aria-label="Seat map">
        {deck.rows.map((row) => (
          <div key={row.left[0].id} className="grid grid-cols-[1fr_1.5rem_1fr] items-center">
            <div className="flex justify-end gap-2">
              {row.left.map((seat) => (
                <SeatButton
                  key={seat.id}
                  seat={seat}
                  berth={berth}
                  booked={bookedSet.has(seat.id)}
                  active={selected.includes(seat.id)}
                  onToggle={onToggle}
                />
              ))}
            </div>
            <span className="text-center text-[10px] text-muted/70" aria-hidden>
              ·
            </span>
            <div className="flex justify-start gap-2">
              {row.right.map((seat) => (
                <SeatButton
                  key={seat.id}
                  seat={seat}
                  berth={berth}
                  booked={bookedSet.has(seat.id)}
                  active={selected.includes(seat.id)}
                  onToggle={onToggle}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <ul className="mt-6 flex flex-wrap gap-3 text-xs text-muted">
        <Legend className="border-line bg-cream" label="Available" />
        <Legend className="border-marigold bg-marigold" label="Selected" />
        <Legend className="border-line bg-[#ebe4d8] line-through" label="Booked" />
        <Legend className="border-[#e7b2a8] bg-blush" label="Ladies" />
      </ul>
    </div>
  );
}

function SeatButton({ seat, berth, booked, active, onToggle }) {
  const label = `${seat.id}${seat.ladies ? ", ladies seat" : ""}, ${booked ? "booked" : active ? "selected" : "available"}`;
  return (
    <button
      type="button"
      disabled={booked}
      aria-pressed={active}
      aria-label={label}
      onClick={() => onToggle(seat.id)}
      className={cn(
        "relative text-[11px] font-semibold transition duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-canopy/30 disabled:cursor-not-allowed",
        berth ? "h-12 w-[4.3rem] rounded-xl" : "h-11 w-11 rounded-lg",
        booked && "border border-line bg-[#ebe4d8] text-muted/80 line-through",
        !booked && active && "animate-pop border border-marigold bg-marigold text-forest shadow-md",
        !booked && !active && seat.ladies && "border border-[#e7b2a8] bg-blush text-ink hover:-translate-y-0.5 hover:border-clay",
        !booked && !active && !seat.ladies && "border border-line bg-cream text-ink hover:-translate-y-0.5 hover:border-canopy",
      )}
    >
      {seat.ladies && !booked ? <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-clay" /> : null}
      {seat.id}
    </button>
  );
}

function Legend({ className, label }) {
  return (
    <li className="inline-flex items-center gap-2">
      <span className={cn("grid h-6 min-w-6 place-items-center rounded-md border px-1 text-[9px]", className)} aria-hidden>
        {label.slice(0, 1)}
      </span>
      {label}
    </li>
  );
}
