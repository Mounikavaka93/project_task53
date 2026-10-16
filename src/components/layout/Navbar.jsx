import { LogOut, Menu, Ticket, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useBooking } from "../../context/BookingContext";
import { cn } from "../../utils/cn";
import Logo from "../brand/Logo";

const LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/search", label: "Search" },
  { to: "/#how", label: "How it works", hash: "#how" },
  { to: "/#offers", label: "Offers", hash: "#offers" },
];

function NavItem({ link, pathname, hash, onPhoto }) {
  if (link.hash) {
    const active = pathname === "/" && hash === link.hash;
    return (
      <Link to={link.to} className={itemClass(active, onPhoto)} aria-current={active ? "page" : undefined}>
        {link.label}
      </Link>
    );
  }
  return (
    <NavLink to={link.to} end={link.end} className={({ isActive }) => itemClass(isActive && !hash, onPhoto)}>
      {link.label}
    </NavLink>
  );
}

function itemClass(isActive, onPhoto) {
  return cn(
    "rounded-full px-3 py-2 text-sm font-medium transition",
    onPhoto
      ? isActive
        ? "bg-white/15 text-white"
        : "text-white/80 hover:bg-white/10 hover:text-white"
      : isActive
        ? "bg-mist text-forest"
        : "text-muted hover:bg-paper hover:text-ink",
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const { booking } = useBooking();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const onPhoto = location.pathname === "/" && !scrolled && !open;

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={cn(
        "no-print sticky top-0 z-40 border-b backdrop-blur-md transition",
        onPhoto ? "border-transparent bg-transparent" : "border-line bg-paper/90",
        scrolled && !onPhoto && "shadow-[0_8px_24px_-20px_rgba(22,56,51,0.7)]",
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Logo light={onPhoto} />
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {LINKS.map((link) => (
            <NavItem key={link.label} link={link} pathname={location.pathname} hash={location.hash} onPhoto={onPhoto} />
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          {booking ? (
            <NavLink to="/confirmation" className={itemClass(location.pathname === "/confirmation", onPhoto)}>
              <Ticket className="h-4 w-4" aria-hidden />
              Ticket
            </NavLink>
          ) : null}
          {user ? (
            <>
              <span className={cn("px-2 text-sm font-medium", onPhoto ? "text-white" : "text-ink")}>{user.name.split(" ")[0]}</span>
              <button type="button" onClick={logout} className={itemClass(false, onPhoto)}>
                <LogOut className="h-4 w-4" aria-hidden />
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={({ isActive }) => itemClass(isActive, onPhoto)}>
                Log in
              </NavLink>
              <NavLink
                to="/signup"
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold transition",
                  onPhoto ? "bg-marigold text-ink hover:bg-white" : "bg-forest text-cream hover:bg-canopy",
                )}
              >
                Sign up
              </NavLink>
            </>
          )}
        </div>
        <button
          type="button"
          className={cn(
            "grid h-11 w-11 shrink-0 place-items-center rounded-full border md:hidden",
            onPhoto ? "border-white/30 bg-black/30 text-white" : "border-line bg-cream text-ink",
          )}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        </button>
      </div>
      <div className={cn("grid md:hidden", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")} id="mobile-nav">
        <div className="overflow-hidden">
          <nav className="flex flex-col gap-1 px-4 pb-4 sm:px-6" aria-label="Mobile">
            {LINKS.map((link) => (
              <NavItem key={link.label} link={link} pathname={location.pathname} hash={location.hash} onPhoto={false} />
            ))}
            {booking ? (
              <NavLink to="/confirmation" className={itemClass(false, false)}>
                Your ticket
              </NavLink>
            ) : null}
            {user ? (
              <button type="button" onClick={logout} className={cn(itemClass(false, false), "text-left")}>
                Log out {user.name.split(" ")[0]}
              </button>
            ) : (
              <>
                <NavLink to="/login" className={({ isActive }) => itemClass(isActive)}>
                  Log in
                </NavLink>
                <NavLink to="/signup" className={({ isActive }) => itemClass(isActive)}>
                  Sign up
                </NavLink>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
