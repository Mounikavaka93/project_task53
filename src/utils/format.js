export function toISODate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function todayISO() {
  return toISODate(new Date());
}

export function tomorrowISO() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return toISODate(date);
}

export function isISODate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

export function isBookableDate(value) {
  return isISODate(value) && value >= todayISO();
}

export function addDays(iso, days) {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);
  return toISODate(date);
}

export function formatDate(iso) {
  if (!isISODate(iso)) return iso;
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatStamp(iso) {
  return new Date(iso).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  });
}

export function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (!mins) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export function formatINR(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCount(amount) {
  return new Intl.NumberFormat("en-IN").format(amount);
}

export function seatLabel(count) {
  return count === 1 ? "1 seat left" : `${count} seats left`;
}

export const TIME_SLOTS = [
  { id: "before", label: "Before 6 AM" },
  { id: "morning", label: "6 AM – 12 PM" },
  { id: "afternoon", label: "12 PM – 6 PM" },
  { id: "evening", label: "After 6 PM" },
];

export function timeSlot(clock) {
  const hour = Number(String(clock).slice(0, 2));
  if (hour < 6) return "before";
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
}

export function searchPath({ from, to, date }) {
  const params = new URLSearchParams({ from, to, date });
  return `/search?${params.toString()}`;
}

export function busPath(busId, trip) {
  const params = new URLSearchParams({ from: trip.from, to: trip.to, date: trip.date });
  return `/bus/${busId}?${params.toString()}`;
}

export function makePnr() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint32Array(6);
  crypto.getRandomValues(bytes);
  let pnr = "CL";
  bytes.forEach((value) => {
    pnr += alphabet[value % alphabet.length];
  });
  return pnr;
}
