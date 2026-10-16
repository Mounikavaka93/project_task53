import Stepper from "./Stepper";

export default function PageHeader({ eyebrow, title, lede, step, children }) {
  return (
    <header className="relative overflow-hidden border-b border-black/20 text-cream">
      <img src="/bus-hero.jpg" alt="" className="animate-kenburns absolute inset-0 h-full w-full object-cover object-[center_35%]" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/45" />
      <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        {step ? <Stepper current={step} tone="light" /> : null}
        {eyebrow ? <p className={cnEyebrow(step)}>{eyebrow}</p> : null}
        <h1 className="mt-2 max-w-3xl font-serif text-3xl tracking-tight text-white sm:text-4xl">{title}</h1>
        {lede ? <p className="mt-3 max-w-2xl text-sm leading-6 text-white/75 sm:text-base">{lede}</p> : null}
        {children}
      </div>
    </header>
  );
}

function cnEyebrow(step) {
  return `${step ? "mt-6" : ""} text-xs font-semibold uppercase tracking-[0.16em] text-marigold`;
}
