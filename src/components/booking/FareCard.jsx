import { formatINR } from "../../utils/format";

export default function FareCard({ title = "Fare summary", rows, total, children }) {
  return (
    <section className="rounded-3xl border border-line bg-cream p-5 shadow-[0_16px_40px_-28px_rgba(22,56,51,0.45)]">
      <h2 className="font-serif text-2xl tracking-tight text-ink">{title}</h2>
      <dl className="mt-4 space-y-2.5 text-sm">
        {rows.map((row) => (
          <div key={row.label} className="flex items-start justify-between gap-4">
            <dt className="text-muted">{row.label}</dt>
            <dd className={row.tone === "discount" ? "font-semibold text-canopy" : "font-medium text-ink"}>{row.value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-4 flex items-end justify-between border-t border-dashed border-line pt-4">
        <span className="text-sm font-semibold">Total</span>
        <span className="font-serif text-3xl tracking-tight">{formatINR(total)}</span>
      </div>
      {children}
    </section>
  );
}
