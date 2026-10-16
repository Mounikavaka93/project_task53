import { ArrowLeft } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import FareCard from "../components/booking/FareCard";
import AmenityList from "../components/bus/AmenityList";
import SeatMap, { MAX_SEATS } from "../components/bus/SeatMap";
import PageHeader from "../components/layout/PageHeader";
import Button from "../components/ui/Button";
import { useBooking } from "../context/BookingContext";
import { CANCELLATION, getBus, isCity } from "../data/fleet";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useTripParams } from "../hooks/useTripParams";
import { quoteFare } from "../utils/fare";
import { addDays, formatDate, formatINR, isBookableDate, searchPath } from "../utils/format";

export default function BusDetails() {
  const { busId } = useParams();
  const { from, to, date } = useTripParams();
  const navigate = useNavigate();
  const { holdSeats, selectedBus, selectedSeats, boarding, dropping } = useBooking();
  const tripReady = isCity(from) && isCity(to) && from !== to && isBookableDate(date);
  const bus = useMemo(
    () => (tripReady ? getBus(from, to, date, busId) : null),
    [tripReady, from, to, date, busId],
  );

  const tripKey = `${from}|${to}|${date}|${busId}`;
  const restored = restoreHold(bus, selectedBus, selectedSeats, boarding, dropping);
  const [selected, setSelected] = useState(restored.selected);
  const [board, setBoard] = useState(restored.board);
  const [drop, setDrop] = useState(restored.drop);
  const [message, setMessage] = useState("");
  const [draftKey, setDraftKey] = useState(tripKey);

  if (draftKey !== tripKey) {
    const next = restoreHold(bus, selectedBus, selectedSeats, boarding, dropping);
    setDraftKey(tripKey);
    setSelected(next.selected);
    setBoard(next.board);
    setDrop(next.drop);
    setMessage("");
  }

  useDocumentTitle(bus ? bus.name : "Coach");

  if (!bus) {
    return (
      <PageHeader eyebrow="Coach" title="This coach is not on that trip" lede="Check the cities and the date, then search again.">
        <Link to={tripReady ? searchPath({ from, to, date }) : "/search"} className="mt-4 inline-flex text-sm font-semibold text-marigold hover:text-white">
          Back to search
        </Link>
      </PageHeader>
    );
  }

  const fare = quoteFare({ price: bus.price, seatCount: selected.length, departure: bus.departure });
  const arrivalDate = addDays(date, bus.arrivalOffset);

  function toggle(id) {
    if (bus.bookedSeats.includes(id)) return;
    if (selected.includes(id)) {
      setSelected(selected.filter((seat) => seat !== id));
      setMessage("");
      return;
    }
    if (selected.length >= MAX_SEATS) {
      setMessage("You can hold up to 6 seats on one booking.");
      return;
    }
    setMessage("");
    setSelected([...selected, id]);
  }

  function proceed() {
    if (!selected.length) {
      setMessage("Select at least one seat to continue.");
      return;
    }
    holdSeats(bus, selected, board, drop);
    navigate("/checkout");
  }

  const rows = [
    { label: `${selected.length || 0} × ${formatINR(bus.price)}`, value: formatINR(fare.base) },
    { label: "GST 5%", value: formatINR(fare.gst) },
    { label: "Platform fee", value: formatINR(fare.fee) },
  ];

  return (
    <>
      <PageHeader step="seats" eyebrow={bus.type} title={bus.name} lede={`${bus.rating.toFixed(1)} rating · ${bus.durationLabel} on the road`}>
        <Link
          to={searchPath({ from, to, date })}
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-marigold hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          All coaches
        </Link>
      </PageHeader>
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <section className="rounded-3xl border border-line bg-cream p-5">
            <div className="grid gap-6 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
              <div>
                <p className="font-serif text-3xl">{bus.departure}</p>
                <p className="mt-1 text-sm font-medium">{bus.from}</p>
                <p className="text-xs text-muted">{formatDate(date)}</p>
              </div>
              <p className="text-sm font-medium text-muted sm:text-center">{bus.durationLabel}</p>
              <div className="sm:text-right">
                <p className="font-serif text-3xl">
                  {bus.arrival}
                  {bus.arrivalOffset ? <sup className="ml-1 text-sm text-marigold-deep">+{bus.arrivalOffset}</sup> : null}
                </p>
                <p className="mt-1 text-sm font-medium">{bus.to}</p>
                <p className="text-xs text-muted">{formatDate(arrivalDate)}</p>
              </div>
            </div>
            <div className="mt-5">
              <AmenityList items={bus.amenities} />
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-2">
            <PointSelect label="Boarding point" value={board} options={bus.boardingPoints} onChange={setBoard} />
            <PointSelect label="Dropping point" value={drop} options={bus.droppingPoints} onChange={setDrop} />
          </section>

          <section>
            <div className="mb-3 flex items-end justify-between gap-3">
              <h2 className="font-serif text-2xl">Choose seats</h2>
              <p className="text-sm text-muted">
                {selected.length}/{MAX_SEATS} selected
              </p>
            </div>
            <SeatMap layout={bus.layout} booked={bus.bookedSeats} selected={selected} onToggle={toggle} />
            {message ? (
              <p role="status" className="mt-3 rounded-2xl bg-blush px-4 py-3 text-sm font-medium text-clay">
                {message}
              </p>
            ) : null}
          </section>

          <section className="rounded-3xl border border-line bg-cream p-5">
            <h2 className="font-serif text-2xl">Cancellation</h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
              {CANCELLATION.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="h-fit lg:sticky lg:top-24">
          <FareCard title="This booking" rows={selected.length ? rows : []} total={fare.total}>
            {selected.length ? (
              <ul className="mt-4 flex flex-wrap gap-2">
                {selected.map((seat) => (
                  <li key={seat}>
                    <button
                      type="button"
                      onClick={() => toggle(seat)}
                      className="rounded-full bg-mist px-3 py-1 text-xs font-semibold text-forest"
                    >
                      {seat}
                      {bus.ladiesSeats.includes(seat) ? " · ladies" : ""} ×
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-muted">Select a seat to see GST and the platform fee.</p>
            )}
            <Button className="mt-5 w-full" onClick={proceed}>
              Continue with {selected.length || "no"} {selected.length === 1 ? "seat" : "seats"}
            </Button>
          </FareCard>
        </aside>
      </div>
    </>
  );
}

function restoreHold(bus, selectedBus, selectedSeats, boarding, dropping) {
  if (!bus) return { selected: [], board: "", drop: "" };
  const same =
    selectedBus?.id === bus.id &&
    selectedBus.from === bus.from &&
    selectedBus.to === bus.to &&
    selectedBus.date === bus.date;
  return {
    selected: same ? selectedSeats.filter((id) => !bus.bookedSeats.includes(id)) : [],
    board: same && boarding ? boarding : bus.boardingPoints[0],
    drop: same && dropping ? dropping : bus.droppingPoints[0],
  };
}

function PointSelect({ label, value, options, onChange }) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <label htmlFor={id} className="block rounded-3xl border border-line bg-cream p-4">
      <span className="text-sm font-medium text-ink">{label}</span>
      <select id={id} className="field mt-2" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
