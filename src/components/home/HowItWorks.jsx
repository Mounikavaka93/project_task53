import Reveal from "../ui/Reveal";

const STEPS = [
  { n: "01", title: "Name the trip", copy: "Pick two cities and a date. Swap them if you meant the return." },
  { n: "02", title: "Compare coaches", copy: "Filter by type and time of day, then sort by price, rating, or seats left." },
  { n: "03", title: "Tap the seat", copy: "Choose up to six seats. Ladies seats are marked, and booked ones will not click." },
  { n: "04", title: "Add the names", copy: "Passenger details, a contact number, and a payment method. Then the ticket." },
];

export default function HowItWorks() {
  return (
    <section id="how" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <Reveal>
        <p className="text-xs font-semibold tracking-[0.16em] text-canopy uppercase">How it works</p>
        <h2 className="mt-2 font-serif text-3xl tracking-tight sm:text-4xl">Four steps, then you are booked.</h2>
      </Reveal>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step, index) => (
          <Reveal key={step.n} delay={index * 70}>
            <article className="h-full rounded-3xl border border-line bg-cream p-5">
              <p className="font-serif text-3xl text-marigold-deep">{step.n}</p>
              <h3 className="mt-3 font-serif text-2xl">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{step.copy}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
