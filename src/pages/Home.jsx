import { Link } from "react-router-dom";
import FeatureGrid from "../components/home/FeatureGrid";
import Hero from "../components/home/Hero";
import HowItWorks from "../components/home/HowItWorks";
import Offers from "../components/home/Offers";
import PopularRoutes from "../components/home/PopularRoutes";
import Testimonials from "../components/home/Testimonials";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

const STATS = [
  { value: "20", label: "Cities you can search" },
  { value: "8", label: "Coaches on every route" },
  { value: "6", label: "Seats on one booking" },
  { value: "5%", label: "GST shown before you pay" },
];

export default function Home() {
  useDocumentTitle("");

  return (
    <>
      <Hero />
      <section className="mx-auto mt-8 max-w-6xl px-4 sm:px-6">
        <dl className="grid grid-cols-2 overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="bg-cream px-5 py-6">
              <dt className="font-serif text-3xl text-forest">{stat.value}</dt>
              <dd className="mt-1 text-sm text-muted">{stat.label}</dd>
            </div>
          ))}
        </dl>
      </section>
      <PopularRoutes />
      <FeatureGrid />
      <HowItWorks />
      <Offers />
      <Testimonials />
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="relative flex flex-col items-start justify-between gap-6 overflow-hidden rounded-[2rem] px-6 py-10 text-cream sm:px-10 md:flex-row md:items-center">
          <img src="/bus-hero.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/65" />
          <div className="relative">
            <h2 className="font-serif text-3xl tracking-tight sm:text-4xl">Where are you headed?</h2>
            <p className="mt-2 max-w-lg text-sm leading-6 text-white/80">
              Pick two cities and a date. The seat map is the next page.
            </p>
          </div>
          <a
            href="#search"
            className="relative inline-flex rounded-full bg-marigold px-5 py-3 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:bg-white"
          >
            Search coaches
          </a>
        </div>
      </section>
      <p className="sr-only">
        Already booked? <Link to="/confirmation">Open your ticket</Link>
      </p>
    </>
  );
}
