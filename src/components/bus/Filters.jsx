import { SlidersHorizontal } from "lucide-react";
import { TIME_SLOTS } from "../../utils/format";
import { cn } from "../../utils/cn";

export default function Filters({ types, selectedTypes, selectedSlots, onToggleType, onToggleSlot, onClear, active }) {
  return (
    <div className="rounded-3xl border border-line bg-cream p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="inline-flex items-center gap-2 font-serif text-2xl text-ink">
          <SlidersHorizontal className="h-4 w-4 text-canopy" aria-hidden />
          Filters
        </h2>
        {active ? (
          <button type="button" onClick={onClear} className="text-sm font-semibold text-canopy hover:text-forest">
            Clear
          </button>
        ) : null}
      </div>
      <fieldset className="mt-5">
        <legend className="text-xs font-semibold tracking-[0.14em] text-muted uppercase">Bus type</legend>
        <div className="mt-3 flex flex-col gap-2">
          {types.map((type) => (
            <label key={type} className="flex cursor-pointer items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                className="h-4 w-4 accent-canopy"
                checked={selectedTypes.includes(type)}
                onChange={() => onToggleType(type)}
              />
              {type}
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset className="mt-6">
        <legend className="text-xs font-semibold tracking-[0.14em] text-muted uppercase">Departure</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {TIME_SLOTS.map((slot) => {
            const on = selectedSlots.includes(slot.id);
            return (
              <button
                key={slot.id}
                type="button"
                aria-pressed={on}
                onClick={() => onToggleSlot(slot.id)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                  on ? "border-forest bg-forest text-cream" : "border-line bg-paper text-muted hover:text-ink",
                )}
              >
                {slot.label}
              </button>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}
