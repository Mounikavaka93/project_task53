import { MapPin } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { CITIES } from "../../data/fleet";
import { cn } from "../../utils/cn";

export default function LocationField({ id, label, value, exclude, error, onChange, placeholder }) {
  const listId = useId();
  const wrapRef = useRef(null);
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);

  const previousValue = useRef(value);
  useEffect(() => {
    if (value === previousValue.current) return;
    previousValue.current = value;
    if (value) {
      setQuery(value);
      return;
    }
    setQuery((current) => {
      const exact = CITIES.some((city) => city.toLowerCase() === current.trim().toLowerCase());
      return exact ? "" : current;
    });
  }, [value]);

  const needle = query.trim().toLowerCase();
  const matches = CITIES.filter((city) => city !== exclude && city.toLowerCase().includes(needle)).sort((a, b) => {
    const aStart = a.toLowerCase().startsWith(needle) ? 0 : 1;
    const bStart = b.toLowerCase().startsWith(needle) ? 0 : 1;
    return aStart - bStart || a.localeCompare(b);
  });

  useEffect(() => {
    setHighlight(0);
  }, [needle, open]);

  useEffect(() => {
    if (!open) return undefined;
    const onPointer = (event) => {
      if (!wrapRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, [open]);

  function commit(city) {
    setQuery(city);
    onChange(city);
    setOpen(false);
  }

  function handleInput(event) {
    const next = event.target.value;
    setQuery(next);
    setOpen(true);
    const match = CITIES.find((city) => city.toLowerCase() === next.trim().toLowerCase() && city !== exclude);
    onChange(match || "");
    if (match) setQuery(match);
  }

  function onKeyDown(event) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setHighlight((index) => Math.min(index + 1, Math.max(matches.length - 1, 0)));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlight((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter" && open && matches[highlight]) {
      event.preventDefault();
      commit(matches[highlight]);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={wrapRef} className="relative flex flex-col gap-1.5" data-invalid={error ? "true" : undefined}>
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
      </label>
      <div className="relative">
        <MapPin className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-canopy" aria-hidden />
        <input
          id={id}
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className="field pl-10"
          placeholder={placeholder}
          value={query}
          autoComplete="off"
          onChange={handleInput}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
        />
      </div>
      {open ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute top-[calc(100%+0.35rem)] z-30 max-h-64 w-full overflow-auto rounded-2xl border border-line bg-cream p-1 shadow-[0_18px_40px_-24px_rgba(22,56,51,0.55)]"
        >
          {matches.length ? (
            matches.map((city, index) => (
              <li key={city} role="option" aria-selected={value === city}>
                <button
                  type="button"
                  className={cn(
                    "w-full rounded-xl px-3 py-2 text-left text-sm",
                    index === highlight ? "bg-mist text-forest" : "hover:bg-paper",
                  )}
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseEnter={() => setHighlight(index)}
                  onClick={() => commit(city)}
                >
                  {city}
                </button>
              </li>
            ))
          ) : (
            <li className="px-3 py-2 text-sm text-muted">No cities found</li>
          )}
        </ul>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="text-xs font-medium text-clay">
          {error}
        </p>
      ) : null}
    </div>
  );
}
