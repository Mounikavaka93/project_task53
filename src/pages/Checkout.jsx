import { CreditCard, Landmark, Smartphone } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FareCard from "../components/booking/FareCard";
import PageHeader from "../components/layout/PageHeader";
import Button from "../components/ui/Button";
import { Field, TextField } from "../components/ui/Field";
import { useAuth } from "../context/AuthContext";
import { useBooking } from "../context/BookingContext";
import { BANKS } from "../data/content";
import { CANCELLATION } from "../data/fleet";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { cn } from "../utils/cn";
import { quoteFare } from "../utils/fare";
import { formatDate, formatINR, makePnr, searchPath } from "../utils/format";
import { luhnOk, validateAge, validateEmail, validateExpiry, validateName, validatePhone, validateUpi } from "../utils/validate";

const METHODS = [
  { id: "upi", label: "UPI", hint: "GPay, PhonePe, BHIM", icon: Smartphone },
  { id: "card", label: "Card", hint: "Visa, Mastercard, RuPay", icon: CreditCard },
  { id: "netbanking", label: "Net banking", hint: "Pay from your bank", icon: Landmark },
];

const EMPTY_ERRORS = { passengers: {} };

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { selectedBus: bus, selectedSeats, boarding, dropping, search, confirmBooking } = useBooking();
  const missing = useRef(!bus || selectedSeats.length === 0);

  const [contact, setContact] = useState({
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const [passengers, setPassengers] = useState(() =>
    selectedSeats.map((seatId, index) => ({
      seatId,
      name: index === 0 ? user?.name || "" : "",
      age: "",
      gender: "",
    })),
  );
  const [promoInput, setPromoInput] = useState("");
  const [applied, setApplied] = useState("");
  const [promoMessage, setPromoMessage] = useState("");
  const [method, setMethod] = useState("");
  const [upi, setUpi] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [bank, setBank] = useState("");
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState(EMPTY_ERRORS);
  const [submitting, setSubmitting] = useState(false);

  useDocumentTitle("Passenger details");

  useEffect(() => {
    if (!missing.current) return;
    navigate(search.from && search.to && search.date ? searchPath(search) : "/", { replace: true });
  }, [navigate, search]);

  if (!bus || selectedSeats.length === 0) return null;

  const fare = quoteFare({
    price: bus.price,
    seatCount: selectedSeats.length,
    promo: applied,
    departure: bus.departure,
  });

  function updatePassenger(seatId, patch) {
    setPassengers((current) => current.map((passenger) => (passenger.seatId === seatId ? { ...passenger, ...patch } : passenger)));
  }

  function applyPromo() {
    const result = quoteFare({
      price: bus.price,
      seatCount: selectedSeats.length,
      promo: promoInput,
      departure: bus.departure,
    });
    if (!promoInput.trim()) {
      setApplied("");
      setPromoMessage("Enter a code");
      return;
    }
    if (result.promoError || !result.code) {
      setApplied("");
      setPromoMessage(result.promoError || "That code is not active");
      return;
    }
    setApplied(result.code);
    setPromoMessage(`${result.code} applied`);
  }

  function collectErrors() {
    const next = { passengers: {} };
    next.email = validateEmail(contact.email);
    next.phone = validatePhone(contact.phone);
    passengers.forEach((passenger) => {
      const seatErrors = {
        name: validateName(passenger.name, "passenger name"),
        age: validateAge(passenger.age),
        gender: passenger.gender ? "" : "Select a gender",
      };
      if (!seatErrors.gender && bus.ladiesSeats.includes(passenger.seatId) && passenger.gender !== "Female") {
        seatErrors.gender = "This seat is reserved for female passengers";
      }
      if (seatErrors.name || seatErrors.age || seatErrors.gender) next.passengers[passenger.seatId] = seatErrors;
    });
    next.payment = method ? "" : "Choose how you would like to pay";
    if (method === "upi") next.upi = validateUpi(upi);
    if (method === "card") {
      next.cardName = validateName(cardName, "name on the card");
      next.cardNumber = luhnOk(cardNumber) ? "" : "Enter a valid 16-digit card number";
      next.expiry = validateExpiry(expiry);
      next.cvv = /^\d{3}$/.test(cvv) ? "" : "Enter the 3-digit CVV";
    }
    if (method === "netbanking") next.bank = bank ? "" : "Choose a bank";
    next.terms = terms ? "" : "Accept the terms to confirm";
    return next;
  }

  function invalid(next) {
    if (next.email || next.phone || next.payment || next.upi || next.cardName || next.cardNumber || next.expiry || next.cvv || next.bank || next.terms) {
      return true;
    }
    return Object.keys(next.passengers).length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const next = collectErrors();
    setErrors(next);
    if (invalid(next)) {
      requestAnimationFrame(() => {
        document.querySelector("[data-invalid='true']")?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
      return;
    }
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    const ticket = {
      pnr: makePnr(),
      bookedAt: new Date().toISOString(),
      bus: {
        id: bus.id,
        name: bus.name,
        type: bus.type,
        from: bus.from,
        to: bus.to,
        date: bus.date,
        departure: bus.departure,
        arrival: bus.arrival,
        arrivalOffset: bus.arrivalOffset,
        durationLabel: bus.durationLabel,
        boarding,
        dropping,
      },
      seats: selectedSeats,
      passengers: passengers.map((passenger) => ({
        seatId: passenger.seatId,
        name: passenger.name.trim(),
        age: Number(passenger.age),
        gender: passenger.gender,
      })),
      contact: {
        email: contact.email.trim(),
        phone: contact.phone.replace(/\s+/g, ""),
      },
      fare,
      paymentLabel: METHODS.find((item) => item.id === method)?.label || method,
    };
    confirmBooking(ticket);
    navigate("/confirmation", { replace: true, state: { booking: ticket } });
  }

  const rows = [
    { label: `${selectedSeats.length} × ${formatINR(bus.price)}`, value: formatINR(fare.base) },
    ...(fare.discount ? [{ label: `${applied} discount`, value: `−${formatINR(fare.discount)}`, tone: "discount" }] : []),
    { label: "GST 5%", value: formatINR(fare.gst) },
    { label: "Platform fee", value: formatINR(fare.fee) },
  ];

  return (
    <>
      <PageHeader
        step="passengers"
        eyebrow="Checkout"
        title="Passenger details"
        lede={`${bus.name} · ${bus.from} to ${bus.to} · ${formatDate(bus.date)} · seats ${selectedSeats.join(", ")}`}
      />
      <form id="checkout-form" noValidate onSubmit={handleSubmit} className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          {!user ? (
            <p className="rounded-2xl bg-mist px-4 py-3 text-sm text-forest">
              <Link to="/login?next=/checkout" className="font-semibold underline">
                Log in
              </Link>{" "}
              to prefill your name and email. You can also continue as a guest.
            </p>
          ) : null}

          <section className="rounded-3xl border border-line bg-cream p-5">
            <h2 className="font-serif text-2xl">Contact</h2>
            <p className="mt-1 text-sm text-muted">The ticket and PNR use this email and mobile number.</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <TextField
                id="contact-email"
                label="Email"
                type="email"
                autoComplete="email"
                value={contact.email}
                error={errors.email}
                onChange={(event) => setContact({ ...contact, email: event.target.value })}
              />
              <TextField
                id="contact-phone"
                label="Mobile number"
                inputMode="numeric"
                autoComplete="tel"
                placeholder="10-digit mobile"
                value={contact.phone}
                error={errors.phone}
                onChange={(event) => setContact({ ...contact, phone: event.target.value })}
              />
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-2xl">Passengers</h2>
            {passengers.map((passenger, index) => {
              const seatErrors = errors.passengers[passenger.seatId] || {};
              const ladies = bus.ladiesSeats.includes(passenger.seatId);
              return (
                <article key={passenger.seatId} className="rounded-3xl border border-line bg-cream p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-serif text-xl">Passenger {index + 1}</h3>
                    <span className="rounded-full bg-marigold/20 px-2.5 py-0.5 text-xs font-semibold text-forest">
                      Seat {passenger.seatId}
                    </span>
                    {ladies ? <span className="text-xs font-semibold text-clay">Reserved for women</span> : null}
                  </div>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <TextField
                      id={`name-${passenger.seatId}`}
                      label="Full name"
                      autoComplete="name"
                      value={passenger.name}
                      error={seatErrors.name}
                      onChange={(event) => updatePassenger(passenger.seatId, { name: event.target.value })}
                    />
                    <TextField
                      id={`age-${passenger.seatId}`}
                      label="Age"
                      inputMode="numeric"
                      value={passenger.age}
                      error={seatErrors.age}
                      onChange={(event) => updatePassenger(passenger.seatId, { age: event.target.value })}
                    />
                  </div>
                  <fieldset className="mt-4" data-invalid={seatErrors.gender ? "true" : undefined}>
                    <legend className="text-sm font-medium text-ink">Gender</legend>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {["Female", "Male", "Other"].map((gender) => (
                        <label
                          key={gender}
                          className={cn(
                            "cursor-pointer rounded-full border px-3 py-1.5 text-sm font-medium transition",
                            passenger.gender === gender ? "border-forest bg-forest text-cream" : "border-line bg-paper text-ink hover:border-forest",
                          )}
                        >
                          <input
                            type="radio"
                            className="sr-only"
                            name={`gender-${passenger.seatId}`}
                            value={gender}
                            checked={passenger.gender === gender}
                            onChange={() => updatePassenger(passenger.seatId, { gender })}
                          />
                          {gender}
                        </label>
                      ))}
                    </div>
                    {seatErrors.gender ? <p className="mt-2 text-xs font-medium text-clay">{seatErrors.gender}</p> : null}
                  </fieldset>
                </article>
              );
            })}
          </section>

          <section className="rounded-3xl border border-line bg-cream p-5">
            <h2 className="font-serif text-2xl">Promo code</h2>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                value={promoInput}
                onChange={(event) => setPromoInput(event.target.value.toUpperCase())}
                placeholder="FIRST10 or NIGHT15"
                aria-label="Promo code"
                className="field uppercase"
              />
              <Button variant="outline" onClick={applyPromo}>
                Apply
              </Button>
            </div>
            {promoMessage ? (
              <p className={`mt-2 text-sm font-medium ${promoMessage.endsWith("applied") ? "text-forest" : "text-clay"}`}>{promoMessage}</p>
            ) : (
              <p className="mt-2 text-xs text-muted">FIRST10 is 10% off. NIGHT15 is 15% off departures from 9 PM to 6 AM.</p>
            )}
            {applied ? (
              <button
                type="button"
                className="mt-2 text-xs font-semibold text-canopy"
                onClick={() => {
                  setApplied("");
                  setPromoInput("");
                  setPromoMessage("");
                }}
              >
                Remove {applied}
              </button>
            ) : null}
          </section>

          <section className="rounded-3xl border border-line bg-cream p-5" data-invalid={errors.payment ? "true" : undefined}>
            <h2 className="font-serif text-2xl">Payment</h2>
            <p className="mt-1 text-sm text-muted">Nothing is charged. Card numbers are checked, then discarded.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {METHODS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={method === item.id}
                  onClick={() => setMethod(item.id)}
                  className={cn(
                    "rounded-2xl border p-4 text-left transition",
                    method === item.id ? "border-forest bg-mist" : "border-line bg-paper hover:border-forest",
                  )}
                >
                  <item.icon className="h-5 w-5 text-canopy" aria-hidden />
                  <p className="mt-3 text-sm font-semibold">{item.label}</p>
                  <p className="text-xs text-muted">{item.hint}</p>
                </button>
              ))}
            </div>
            {errors.payment ? <p className="mt-3 text-xs font-medium text-clay">{errors.payment}</p> : null}

            {method === "upi" ? (
              <div className="mt-4">
                <TextField id="upi" label="UPI ID" placeholder="name@bank" value={upi} error={errors.upi} onChange={(event) => setUpi(event.target.value)} />
              </div>
            ) : null}

            {method === "card" ? (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <TextField id="card-name" label="Name on card" autoComplete="cc-name" value={cardName} error={errors.cardName} onChange={(event) => setCardName(event.target.value)} />
                </div>
                <div className="sm:col-span-2">
                  <TextField id="card-number" label="Card number" inputMode="numeric" autoComplete="cc-number" placeholder="16 digits" value={cardNumber} error={errors.cardNumber} onChange={(event) => setCardNumber(event.target.value)} />
                </div>
                <TextField id="card-expiry" label="Expiry" placeholder="MM/YY" autoComplete="cc-exp" value={expiry} error={errors.expiry} onChange={(event) => setExpiry(event.target.value)} />
                <TextField id="card-cvv" label="CVV" inputMode="numeric" autoComplete="cc-csc" value={cvv} error={errors.cvv} onChange={(event) => setCvv(event.target.value)} />
              </div>
            ) : null}

            {method === "netbanking" ? (
              <div className="mt-4" data-invalid={errors.bank ? "true" : undefined}>
                <Field id="bank" label="Bank" error={errors.bank}>
                  <select id="bank" className="field" value={bank} aria-invalid={Boolean(errors.bank)} onChange={(event) => setBank(event.target.value)}>
                    <option value="">Select a bank</option>
                    {BANKS.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            ) : null}
          </section>

          <section className="rounded-3xl border border-line bg-cream p-5" data-invalid={errors.terms ? "true" : undefined}>
            <label className="flex items-start gap-3 text-sm leading-6">
              <input type="checkbox" className="mt-1 h-4 w-4 accent-canopy" checked={terms} onChange={(event) => setTerms(event.target.checked)} />
              <span>I agree to the cancellation rules and confirm these passenger details.</span>
            </label>
            {errors.terms ? <p className="mt-2 text-xs font-medium text-clay">{errors.terms}</p> : null}
            <ul className="mt-3 space-y-1 text-xs leading-5 text-muted">
              {CANCELLATION.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted">
                Total <span className="ml-2 font-serif text-3xl text-ink">{formatINR(fare.total)}</span>
              </p>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Issuing ticket…" : "Confirm booking"}
              </Button>
            </div>
          </section>
        </div>

        <aside className="h-fit space-y-4 lg:sticky lg:top-24">
          <FareCard rows={rows} total={fare.total}>
            <dl className="mt-4 space-y-2 border-t border-dashed border-line pt-4 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Boarding</dt>
                <dd className="text-right font-medium">{boarding}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Dropping</dt>
                <dd className="text-right font-medium">{dropping}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Seats</dt>
                <dd className="text-right font-medium">{selectedSeats.join(", ")}</dd>
              </div>
            </dl>
          </FareCard>
        </aside>
      </form>
    </>
  );
}
