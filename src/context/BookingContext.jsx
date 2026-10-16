import { createContext, useCallback, useContext, useEffect, useState } from "react";

const KEY = "cedarline-booking";

const EMPTY = {
  search: { from: "", to: "", date: "" },
  selectedBus: null,
  selectedSeats: [],
  boarding: "",
  dropping: "",
  booking: null,
};

const BookingContext = createContext(null);

function load() {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw);
    return {
      search: { ...EMPTY.search, ...(parsed.search || {}) },
      selectedBus: parsed.selectedBus || null,
      selectedSeats: Array.isArray(parsed.selectedSeats) ? parsed.selectedSeats : [],
      boarding: parsed.boarding || "",
      dropping: parsed.dropping || "",
      booking: parsed.booking || null,
    };
  } catch {
    return EMPTY;
  }
}

export function BookingProvider({ children }) {
  const [state, setState] = useState(load);

  useEffect(() => {
    try {
      sessionStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* The tab can still book if storage is blocked. */
    }
  }, [state]);

  const setSearch = useCallback((search) => {
    setState((current) => ({ ...current, search }));
  }, []);

  const startSearch = useCallback((search) => {
    setState((current) => ({
      ...current,
      search,
      selectedBus: null,
      selectedSeats: [],
      boarding: "",
      dropping: "",
    }));
  }, []);

  const holdSeats = useCallback((bus, seats, boarding, dropping) => {
    setState((current) => ({
      ...current,
      search: { from: bus.from, to: bus.to, date: bus.date },
      selectedBus: bus,
      selectedSeats: seats,
      boarding,
      dropping,
    }));
  }, []);

  const confirmBooking = useCallback((booking) => {
    setState((current) => ({
      ...current,
      booking,
      selectedBus: null,
      selectedSeats: [],
      boarding: "",
      dropping: "",
    }));
  }, []);

  const value = {
    ...state,
    setSearch,
    startSearch,
    holdSeats,
    confirmBooking,
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) throw new Error("useBooking must be used within BookingProvider");
  return context;
}
