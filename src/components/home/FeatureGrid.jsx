import { Armchair, BadgePercent, Moon, ShieldCheck } from "lucide-react";
import Reveal from "../ui/Reveal";

const FEATURES = [
  {
    icon: Armchair,
    title: "A seat you can see",
    copy: "Sleeper berths and seater rows are drawn before you pay, with booked seats already taken off the map.",
  },
  {
    icon: BadgePercent,
    title: "A fare you can add up",
    copy: "Base fare, a promo if you have one, 5% GST, and a flat platform fee. The total is the number on the ticket.",
  },
  {
    icon: Moon,
    title: "Night runs and day seats",
    copy: "Early shuttles, afternoon semis, and sleepers after 9 PM sit on the same results list.",
  },
  {
    icon: ShieldCheck,
    title: "A PNR when you confirm",
    copy: "Passenger names, seats, and the boarding point land on a ticket you can reopen in this browser.",
  },
];

export default function FeatureGrid() {
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <Reveal>
          <p className="text-xs font-semibold tracking-[0.16em] text-canopy uppercase">Why Cedarline</p>
          <h2 className="mt-2 max-w-xl font-serif text-3xl tracking-tight sm:text-4xl">The booking stays readable.</h2>
        </Reveal>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
            <Reveal key={feature.title} delay={index * 70}>
              <article className="h-full rounded-3xl border border-line bg-paper p-6">
                <Icon className="h-6 w-6 text-canopy" aria-hidden />
                <h3 className="mt-4 font-serif text-2xl">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{feature.copy}</p>
              </article>
            </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
