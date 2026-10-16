import { ArrowLeftRight, CalendarDays, Search } from "lucide-react";
import { useState } from "react";
import { isBookableDate, isISODate, todayISO } from "../../utils/format";
import Button from "../ui/Button";
import LocationField from "./LocationField";

export default function SearchPanel({ value, onChange, onSubmit }) {
  const [submitted, setSubmitted] = useState(false);
  const { from, to, date } = value;

  const errors = {
    from: from ? "" : "Choose a departure city",
    to: !to ? "Choose a destination" : from && from === to ? "Choose a different city" : "",
    date: !date ? "Choose a journey date" : !isISODate(date) || !isBookableDate(date) ? "Choose today or a later date" : "",
  };

  const show = {
    from: submitted ? errors.from : "",
    to: submitted || (from && to && from === to) ? errors.to : "",
    date: submitted ? errors.date : "",
  };

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
    if (errors.from || errors.to || errors.date) return;
    onSubmit({ from, to, date });
  }

  return (
    <form
      id="search"
      onSubmit={handleSubmit}
      className="rounded-[1.75rem] border border-line bg-cream p-4 shadow-[0_24px_50px_-32px_rgba(22,56,51,0.65)] sm:p-6"
    >
      <div className="grid gap-4">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_3rem_minmax(0,1fr)] md:items-start">
          <LocationField
            id="from-city"
            label="From"
            placeholder="Departure city"
            value={from}
            exclude={to}
            error={show.from}
            onChange={(city) => onChange({ from: city })}
          />
          <div className="flex justify-center md:mt-[1.625rem]">
            <button
              type="button"
              aria-label="Swap origin and destination"
              onClick={() => onChange({ from: to, to: from })}
              className="grid h-12 w-12 place-items-center rounded-full border border-line bg-paper text-forest transition hover:border-forest hover:bg-mist"
            >
              <ArrowLeftRight className="h-4 w-4" />
            </button>
          </div>
          <LocationField
            id="to-city"
            label="To"
            placeholder="Destination city"
            value={to}
            exclude={from}
            error={show.to}
            onChange={(city) => onChange({ to: city })}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-[minmax(0,16rem)_auto] sm:items-start">
          <div className="flex flex-col gap-1.5" data-invalid={show.date ? "true" : undefined}>
            <label htmlFor="journey-date" className="text-sm font-medium leading-5 text-ink">
              Journey date
            </label>
            <div className="relative">
              <CalendarDays className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-canopy" aria-hidden />
              <input
                id="journey-date"
                type="date"
                min={todayISO()}
                value={date}
                aria-invalid={Boolean(show.date)}
                aria-describedby={show.date ? "journey-date-error" : undefined}
                onChange={(event) => onChange({ date: event.target.value })}
                className="field pl-10"
              />
            </div>
            {show.date ? (
              <p id="journey-date-error" className="text-xs font-medium text-clay">
                {show.date}
              </p>
            ) : null}
          </div>
          <div className="sm:mt-[1.625rem]">
            <Button type="submit" className="h-12 w-full px-6 sm:w-auto">
              <Search className="h-4 w-4" aria-hidden />
              Search buses
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
