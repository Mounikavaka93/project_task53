import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BusCard from "../components/bus/BusCard";
import Filters from "../components/bus/Filters";
import PageHeader from "../components/layout/PageHeader";
import SearchPanel from "../components/search/SearchPanel";
import { useBooking } from "../context/BookingContext";
import { getBuses, isCity } from "../data/fleet";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useTripParams } from "../hooks/useTripParams";
import { formatDate, isBookableDate, searchPath, timeSlot, tomorrowISO } from "../utils/format";

const SORTS = [
  { id: "departure", label: "Departure" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "rating", label: "Rating" },
  { id: "seats", label: "Seats left" },
];

export default function Search() {
  const { from, to, date } = useTripParams();
  const navigate = useNavigate();
  const { startSearch, setSearch } = useBooking();
  const tripReady = isCity(from) && isCity(to) && from !== to && isBookableDate(date);
  const [editing, setEditing] = useState(!tripReady);
  const [trip, setTrip] = useState({ from, to, date: date || tomorrowISO() });
  const [types, setTypes] = useState([]);
  const [slots, setSlots] = useState([]);
  const [sort, setSort] = useState("departure");
  const [showFilters, setShowFilters] = useState(false);

  useDocumentTitle(tripReady ? `${from} to ${to}` : "Search coaches");

  useEffect(() => {
    setTrip({ from, to, date: date || tomorrowISO() });
    setEditing(!tripReady);
    setTypes([]);
    setSlots([]);
  }, [from, to, date, tripReady]);

  useEffect(() => {
    if (tripReady) setSearch({ from, to, date });
  }, [tripReady, from, to, date, setSearch]);

  const buses = useMemo(() => (tripReady ? getBuses(from, to, date) : []), [tripReady, from, to, date]);
  const typeOptions = useMemo(() => [...new Set(buses.map((bus) => bus.type))], [buses]);

  const visible = useMemo(() => {
    const filtered = buses.filter((bus) => {
      if (types.length && !types.includes(bus.type)) return false;
      if (slots.length && !slots.includes(timeSlot(bus.departure))) return false;
      return true;
    });
    return [...filtered].sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "rating") return b.rating - a.rating || a.departure.localeCompare(b.departure);
      if (sort === "seats") return b.seatsAvailable - a.seatsAvailable;
      return a.departure.localeCompare(b.departure);
    });
  }, [buses, types, slots, sort]);

  function toggle(list, setList, value) {
    setList((current) => (current.includes(value) ? current.filter((item) => item !== value) : [...current, value]));
  }

  return (
    <>
      <PageHeader
        step="trip"
        eyebrow="Search"
        title={tripReady ? `${from} to ${to}` : "Plan a trip"}
        lede={
          tripReady
            ? `${formatDate(date)} · ${buses.length} coaches with live seats`
            : "Choose a departure city, a destination, and a date that has not passed."
        }
      >
        {tripReady && !editing ? (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="mt-4 text-sm font-semibold text-marigold hover:text-white"
          >
            Edit trip
          </button>
        ) : null}
      </PageHeader>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {editing ? (
          <SearchPanel
            value={trip}
            onChange={(patch) => setTrip((current) => ({ ...current, ...patch }))}
            onSubmit={(next) => {
              startSearch(next);
              navigate(searchPath(next));
            }}
          />
        ) : null}

        {tripReady ? (
          <div className={`grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)] ${editing ? "mt-8" : ""}`}>
            <div>
              <button
                type="button"
                className="mb-3 rounded-full border border-line bg-cream px-4 py-2 text-sm font-semibold lg:hidden"
                aria-expanded={showFilters}
                onClick={() => setShowFilters((value) => !value)}
              >
                {showFilters ? "Hide filters" : "Show filters"}
              </button>
              <div className={showFilters ? "block" : "hidden lg:block"}>
                <Filters
                  types={typeOptions}
                  selectedTypes={types}
                  selectedSlots={slots}
                  onToggleType={(type) => toggle(types, setTypes, type)}
                  onToggleSlot={(slot) => toggle(slots, setSlots, slot)}
                  onClear={() => {
                    setTypes([]);
                    setSlots([]);
                  }}
                  active={types.length > 0 || slots.length > 0}
                />
              </div>
            </div>
            <div>
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted" aria-live="polite">
                  {visible.length} {visible.length === 1 ? "coach" : "coaches"}
                </p>
                <label className="flex items-center gap-2 text-sm text-muted">
                  Sort
                  <select
                    value={sort}
                    onChange={(event) => setSort(event.target.value)}
                    className="h-10 rounded-full border border-line bg-cream px-3 text-sm text-ink outline-none focus:border-canopy"
                  >
                    {SORTS.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              {visible.length ? (
                <div className="space-y-4">
                  {visible.map((bus, index) => (
                    <div key={bus.id} className="animate-rise" style={{ animationDelay: `${index * 40}ms` }}>
                      <BusCard bus={bus} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-line bg-cream px-6 py-12 text-center">
                  <p className="font-serif text-2xl">No coaches match these filters</p>
                  <button
                    type="button"
                    className="mt-4 text-sm font-semibold text-canopy"
                    onClick={() => {
                      setTypes([]);
                      setSlots([]);
                    }}
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
