import { TESTIMONIALS } from "../../data/content";
import Reveal from "../ui/Reveal";

export default function Testimonials() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <Reveal>
        <p className="text-xs font-semibold tracking-[0.16em] text-canopy uppercase">On the road</p>
        <h2 className="mt-2 font-serif text-3xl tracking-tight sm:text-4xl">Notes from recent trips</h2>
      </Reveal>
      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {TESTIMONIALS.map((item, index) => (
          <Reveal key={item.name} delay={index * 70}>
            <figure className="flex h-full flex-col rounded-3xl border border-line bg-cream p-6">
              <blockquote className="text-sm leading-7 text-ink">“{item.quote}”</blockquote>
              <figcaption className="mt-6 text-sm">
                <span className="font-semibold">{item.name}</span>
                <span className="text-muted"> · {item.place}</span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
