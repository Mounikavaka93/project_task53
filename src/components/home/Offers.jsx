import Reveal from "../ui/Reveal";

const OFFERS = [
  {
    code: "FIRST10",
    title: "10% off the base fare",
    copy: "Applies on any coach, any time of day. GST is calculated after the discount.",
  },
  {
    code: "NIGHT15",
    title: "15% off night departures",
    copy: "Use it when the coach leaves between 9 PM and 6 AM. Day buses will refuse the code.",
  },
];

export default function Offers() {
  return (
    <section id="offers" className="bg-forest text-cream">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <Reveal>
          <p className="text-xs font-semibold tracking-[0.16em] text-marigold uppercase">Offers</p>
          <h2 className="mt-2 font-serif text-3xl tracking-tight sm:text-4xl">Two codes, written on the ticket.</h2>
        </Reveal>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {OFFERS.map((offer, index) => (
            <Reveal key={offer.code} delay={index * 80}>
              <article className="h-full rounded-3xl border border-white/10 bg-white/5 p-6">
                <p className="inline-flex rounded-full bg-marigold px-3 py-1 text-sm font-semibold tracking-[0.14em] text-forest">
                  {offer.code}
                </p>
                <h3 className="mt-4 font-serif text-3xl">{offer.title}</h3>
                <p className="mt-3 max-w-md text-sm leading-6 text-cream/75">{offer.copy}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
