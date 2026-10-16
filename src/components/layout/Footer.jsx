import { Link } from "react-router-dom";
import { POPULAR_ROUTES } from "../../data/fleet";
import { searchPath, tomorrowISO } from "../../utils/format";
import Logo from "../brand/Logo";

export default function Footer() {
  const date = tomorrowISO();
  return (
    <footer className="no-print mt-auto bg-forest text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <Logo light />
          <p className="mt-4 max-w-sm text-sm leading-6 text-cream/75">
            Intercity coach tickets, from the city pair to the PNR. Compare times, pick a berth, and keep the fare in
            plain sight.
          </p>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-marigold">Travel</h2>
          <ul className="mt-4 space-y-2 text-sm text-cream/80">
            <li>
              <Link to="/search" className="hover:text-cream">
                Search coaches
              </Link>
            </li>
            <li>
              <Link to="/#how" className="hover:text-cream">
                How booking works
              </Link>
            </li>
            <li>
              <Link to="/#offers" className="hover:text-cream">
                Fare codes
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-marigold">Tomorrow</h2>
          <ul className="mt-4 space-y-2 text-sm text-cream/80">
            {POPULAR_ROUTES.slice(0, 4).map(([from, to]) => (
              <li key={`${from}-${to}`}>
                <Link to={searchPath({ from, to, date })} className="hover:text-cream">
                  {from} to {to}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-cream/60 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>Support hours 7:00–23:00 IST · hello@cedarline.example</p>
          <p>Accounts and tickets stay in this browser.</p>
        </div>
      </div>
    </footer>
  );
}
