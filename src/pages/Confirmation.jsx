import { Copy, Printer, Ticket } from "lucide-react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import PageHeader from "../components/layout/PageHeader";
import { LinkButton } from "../components/ui/Button";
import { useBooking } from "../context/BookingContext";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { hashString } from "../utils/hash";
import { addDays, formatDate, formatINR, formatStamp, isISODate } from "../utils/format";

export default function Confirmation() {
  const location = useLocation();
  const { booking } = useBooking();
  const ticket = location.state?.booking || booking;
  const [copied, setCopied] = useState(false);
  useDocumentTitle(ticket ? `Ticket ${ticket.pnr}` : "Ticket");

  if (!ticket) {
    return (
      <PageHeader eyebrow="Ticket" title="No ticket in this browser yet" lede="Search a route and confirm a booking. The PNR stays in this tab.">
        <LinkButton to="/" className="mt-6">
          Find a coach
        </LinkButton>
      </PageHeader>
    );
  }

  const arrivalDate = isISODate(ticket.bus.date) ? addDays(ticket.bus.date, ticket.bus.arrivalOffset || 0) : "";

  async function copyPnr() {
    try {
      await navigator.clipboard.writeText(ticket.pnr);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <>
      <PageHeader
        step="ticket"
        eyebrow="Confirmed"
        title="Your seat is held."
        lede={`Booked ${formatStamp(ticket.bookedAt)}. Show the PNR at ${ticket.bus.boarding}.`}
      >
        <div className="no-print mt-5 flex flex-wrap gap-3">
          <button type="button" onClick={copyPnr} className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-4 py-2 text-sm font-semibold">
            <Copy className="h-4 w-4" aria-hidden />
            {copied ? "Copied" : "Copy PNR"}
          </button>
          <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-full bg-forest px-4 py-2 text-sm font-semibold text-cream">
            <Printer className="h-4 w-4" aria-hidden />
            Print
          </button>
        </div>
      </PageHeader>
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <article className="ticket overflow-hidden rounded-[1.75rem] border border-line bg-cream shadow-[0_24px_50px_-32px_rgba(22,56,51,0.55)]">
          <div className="flex items-start justify-between gap-4 bg-forest px-5 py-6 text-cream sm:px-8">
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.16em] text-marigold uppercase">
                <Ticket className="h-4 w-4" aria-hidden />
                Cedarline
              </p>
              <p className="mt-3 font-serif text-4xl tracking-tight">{ticket.pnr}</p>
              <p className="mt-1 text-sm text-cream/70">Booking reference</p>
            </div>
            <Pattern seed={ticket.pnr} />
          </div>
          <div className="relative px-5 py-6 sm:px-8">
            <div className="absolute top-0 -left-3 h-6 w-6 -translate-y-1/2 rounded-full bg-paper" />
            <div className="absolute top-0 -right-3 h-6 w-6 -translate-y-1/2 rounded-full bg-paper" />
            <div className="grid gap-6 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
              <div>
                <p className="text-xs tracking-wide text-muted uppercase">Departure</p>
                <p className="mt-1 font-serif text-3xl">{ticket.bus.departure}</p>
                <p className="mt-1 font-medium">{ticket.bus.from}</p>
                <p className="text-sm text-muted">{formatDate(ticket.bus.date)}</p>
                <p className="mt-2 text-sm text-muted">Board at {ticket.bus.boarding}</p>
              </div>
              <div className="text-sm font-medium text-muted sm:text-center">
                <p>{ticket.bus.durationLabel}</p>
                <p className="mt-1">{ticket.bus.type}</p>
              </div>
              <div className="sm:text-right">
                <p className="text-xs tracking-wide text-muted uppercase">Arrival</p>
                <p className="mt-1 font-serif text-3xl">
                  {ticket.bus.arrival}
                  {ticket.bus.arrivalOffset ? <sup className="ml-1 text-sm text-marigold-deep">+{ticket.bus.arrivalOffset}</sup> : null}
                </p>
                <p className="mt-1 font-medium">{ticket.bus.to}</p>
                <p className="text-sm text-muted">{arrivalDate ? formatDate(arrivalDate) : ""}</p>
                <p className="mt-2 text-sm text-muted">Drop at {ticket.bus.dropping}</p>
              </div>
            </div>
          </div>
          <div className="border-t border-dashed border-line px-5 py-6 sm:px-8">
            <h2 className="font-serif text-2xl">{ticket.bus.name}</h2>
            <div className="mt-4">
              <div className="hidden grid-cols-[minmax(0,1.4fr)_5rem_6rem_4rem] gap-3 border-b border-line pb-2 text-xs tracking-wide text-muted uppercase sm:grid">
                <span>Passenger</span>
                <span>Age</span>
                <span>Gender</span>
                <span>Seat</span>
              </div>
              <ul>
                {ticket.passengers.map((passenger) => (
                  <li
                    key={passenger.seatId}
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 border-b border-line py-3 text-sm last:border-b-0 sm:grid-cols-[minmax(0,1.4fr)_5rem_6rem_4rem]"
                  >
                    <span className="font-medium">{passenger.name}</span>
                    <span className="hidden sm:block">{passenger.age}</span>
                    <span className="hidden sm:block">{passenger.gender}</span>
                    <span className="text-right font-semibold sm:text-left">{passenger.seatId}</span>
                    <span className="col-span-2 text-xs text-muted sm:hidden">
                      {passenger.age} yrs · {passenger.gender}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <dl className="mt-6 space-y-2 text-sm">
              <Row label="Email" value={ticket.contact.email} />
              <Row label="Mobile" value={ticket.contact.phone} />
              <Row label="Payment" value={ticket.paymentLabel} />
              <Row label="Base fare" value={formatINR(ticket.fare.base)} />
              {ticket.fare.discount ? <Row label="Discount" value={`−${formatINR(ticket.fare.discount)}`} /> : null}
              <Row label="GST" value={formatINR(ticket.fare.gst)} />
              <Row label="Platform fee" value={formatINR(ticket.fare.fee)} />
            </dl>
            <div className="mt-4 flex items-end justify-between border-t border-line pt-4">
              <span className="text-sm font-semibold">Total paid</span>
              <span className="font-serif text-3xl">{formatINR(ticket.fare.total)}</span>
            </div>
          </div>
        </article>
        <div className="no-print mt-6">
          <LinkButton to="/" variant="outline">
            Book another trip
          </LinkButton>
        </div>
      </div>
    </>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}

function Pattern({ seed }) {
  let hash = hashString(seed);
  const cells = [];
  for (let index = 0; index < 49; index += 1) {
    hash = (Math.imul(hash, 1664525) + 1013904223) >>> 0;
    cells.push(hash % 3 === 0);
  }
  return (
    <div className="grid shrink-0 grid-cols-7 gap-1 rounded-2xl bg-cream p-2" aria-hidden="true">
      {cells.map((on, index) => (
        <span key={index} className={`h-2 w-2 ${on ? "bg-forest" : "bg-line"}`} />
      ))}
    </div>
  );
}
