import { formatDuration } from "../utils/format";
import { hashString } from "../utils/hash";

export const CITIES = [
  "Ahmedabad",
  "Bengaluru",
  "Bhopal",
  "Chandigarh",
  "Chennai",
  "Delhi",
  "Goa",
  "Hyderabad",
  "Indore",
  "Jaipur",
  "Kochi",
  "Kolkata",
  "Lucknow",
  "Mumbai",
  "Mysuru",
  "Nagpur",
  "Nashik",
  "Pune",
  "Surat",
  "Udaipur",
];

export const POPULAR_ROUTES = [
  ["Mumbai", "Pune"],
  ["Bengaluru", "Hyderabad"],
  ["Delhi", "Jaipur"],
  ["Chennai", "Bengaluru"],
  ["Ahmedabad", "Surat"],
  ["Goa", "Mumbai"],
];

export const CANCELLATION = [
  "Free cancellation until 6 hours before departure.",
  "Half the base fare is charged inside that 6-hour window.",
  "No refund within 1 hour of departure.",
];

const POINTS = {
  Mumbai: ["Dadar TT", "Sion Circle", "Borivali East", "Vashi Plaza"],
  Pune: ["Shivajinagar", "Swargate", "Wakad Bridge", "Hinjawadi Phase 1"],
  Nashik: ["CBS Nashik", "Dwarka Circle", "Mumbai Naka", "Satpur"],
  Nagpur: ["Ganeshpeth", "Sitabuldi", "Wardha Road", "Kamptee Road"],
  Ahmedabad: ["Paldi", "Kalupur", "Iscon Circle", "CTM"],
  Surat: ["Adajan", "Udhna", "Railway Station", "Vesu"],
  Jaipur: ["Sindhi Camp", "Narayan Singh Circle", "Tonk Road", "Vaishali Nagar"],
  Delhi: ["Kashmere Gate", "RK Ashram", "Sarai Kale Khan", "Dhaula Kuan"],
  Bengaluru: ["Majestic", "Electronic City", "Hebbal", "Silk Board"],
  Mysuru: ["City Bus Stand", "Bannimantap", "Suburban Stand", "Railway Station"],
  Hyderabad: ["MGBS", "Jubilee Bus Station", "Gachibowli", "LB Nagar"],
  Chennai: ["Koyambedu", "Tambaram", "Guindy", "Vadapalani"],
  Kochi: ["Vyttila Hub", "Ernakulam Jetty", "Aluva", "Kaloor"],
  Goa: ["Panaji KTC", "Mapusa", "Madgaon", "Porvorim"],
  Indore: ["Gangwal", "Vijay Nagar", "Palasia", "Bhanwarkuan"],
  Bhopal: ["ISBT Habibganj", "Nadra Bus Stand", "MP Nagar", "Bairagarh"],
  Kolkata: ["Esplanade", "Karunamoyee", "Ultadanga", "Howrah"],
  Lucknow: ["Alambagh", "Kaiserbagh", "Charbagh", "Gomti Nagar"],
  Chandigarh: ["ISBT Sector 43", "ISBT Sector 17", "Tribune Chowk", "Zirakpur"],
  Udaipur: ["Roadways Stand", "Fatehpura", "Sukher", "City Station"],
};

const PAIR_MINUTES = {
  "Ahmedabad|Mumbai": 480,
  "Ahmedabad|Surat": 240,
  "Bengaluru|Chennai": 360,
  "Bengaluru|Hyderabad": 510,
  "Bengaluru|Mysuru": 180,
  "Bhopal|Indore": 210,
  "Chandigarh|Delhi": 270,
  "Chennai|Hyderabad": 630,
  "Chennai|Kochi": 660,
  "Delhi|Jaipur": 330,
  "Delhi|Lucknow": 480,
  "Goa|Mumbai": 600,
  "Jaipur|Udaipur": 420,
  "Kolkata|Lucknow": 780,
  "Mumbai|Nashik": 240,
  "Mumbai|Pune": 210,
  "Mumbai|Surat": 300,
  "Bengaluru|Pune": 840,
};

const OPERATORS = [
  {
    id: "metro-shuttle",
    name: "Metro Shuttle",
    type: "Non-AC Seater",
    layout: "seater",
    factor: 0.64,
    rating: 4.0,
    departure: "05:40",
    offset: 0,
    amenities: ["Openable windows", "Water bottle"],
  },
  {
    id: "dayliner",
    name: "Dayliner",
    type: "AC Seater",
    layout: "seater",
    factor: 0.96,
    rating: 4.4,
    departure: "08:40",
    offset: -10,
    amenities: ["Charging point", "Water bottle"],
  },
  {
    id: "hillseat",
    name: "Hillseat Express",
    type: "Non-AC Seater",
    layout: "seater",
    factor: 0.72,
    rating: 4.1,
    departure: "11:20",
    offset: 15,
    amenities: ["Openable windows", "Water bottle"],
  },
  {
    id: "palm-semi",
    name: "Palm Semi",
    type: "AC Semi-Sleeper",
    layout: "seater",
    factor: 1.12,
    rating: 4.3,
    departure: "14:05",
    offset: 25,
    amenities: ["Charging point", "Extra legroom", "Water bottle"],
    badge: "",
  },
  {
    id: "marigold-gold",
    name: "Marigold Gold",
    type: "AC Seater",
    layout: "seater",
    factor: 1.04,
    rating: 4.6,
    departure: "17:50",
    offset: 5,
    amenities: ["Charging point", "Recliner", "Water bottle"],
  },
  {
    id: "vayu-premier",
    name: "Vayu Premier",
    type: "AC Sleeper",
    layout: "sleeper",
    factor: 1.38,
    rating: 4.8,
    departure: "21:10",
    offset: -15,
    amenities: ["Blanket", "Charging point", "Reading light", "Water bottle"],
    badge: "Bestseller",
  },
  {
    id: "coral-sleeper",
    name: "Coral Sleeper",
    type: "AC Sleeper",
    layout: "sleeper",
    factor: 1.26,
    rating: 4.5,
    departure: "22:45",
    offset: 20,
    amenities: ["Blanket", "Charging point", "Water bottle"],
  },
  {
    id: "quiet-cabin",
    name: "Quiet Cabin",
    type: "AC Sleeper",
    layout: "sleeper",
    factor: 1.52,
    rating: 4.9,
    departure: "23:30",
    offset: 10,
    amenities: ["Blanket", "Charging point", "Eye mask", "Water bottle"],
    badge: "Top rated",
  },
];

export function isCity(name) {
  return CITIES.includes(name);
}

export function seatPlan(layout) {
  if (layout === "sleeper") {
    return ["Lower", "Upper"].map((deck) => {
      const prefix = deck === "Lower" ? "L" : "U";
      const rows = [];
      for (let row = 1; row <= 8; row += 1) {
        rows.push({
          left: [{ id: `${prefix}${row}W`, ladies: deck === "Lower" && row <= 2 }],
          right: [{ id: `${prefix}${row}A`, ladies: false }],
        });
      }
      return { name: deck, rows };
    });
  }

  const rows = [];
  for (let row = 1; row <= 9; row += 1) {
    rows.push({
      left: [
        { id: `${row}A`, ladies: row <= 2 },
        { id: `${row}B`, ladies: row === 1 },
      ],
      right: [
        { id: `${row}C`, ladies: false },
        { id: `${row}D`, ladies: false },
      ],
    });
  }
  return [{ name: "Coach", rows }];
}

export function flattenSeats(decks) {
  const seats = [];
  decks.forEach((deck) => {
    deck.rows.forEach((row) => {
      seats.push(...row.left, ...row.right);
    });
  });
  return seats;
}

function pointsFor(city) {
  return (
    POINTS[city] ?? [
      `${city} Central Stand`,
      `${city} Railway Station`,
      `${city} City Mall`,
      `${city} Highway Bypass`,
    ]
  );
}

function routeMinutes(from, to) {
  const key = [from, to].sort().join("|");
  if (PAIR_MINUTES[key]) return PAIR_MINUTES[key];
  return 240 + (hashString(key) % 540);
}

function clockFromMinutes(total) {
  const dayOffset = Math.floor(total / 1440);
  const minutes = ((total % 1440) + 1440) % 1440;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return {
    label: `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`,
    dayOffset,
  };
}

function parseClock(clock) {
  const [hours, minutes] = clock.split(":").map(Number);
  return hours * 60 + minutes;
}

function pickBooked(seats, seed) {
  const ratio = 0.3 + (hashString(`${seed}:ratio`) % 20) / 100;
  const maxBooked = Math.max(0, seats.length - 6);
  const take = Math.min(maxBooked, Math.round(seats.length * ratio));
  return [...seats]
    .sort((a, b) => hashString(`${seed}:${a.id}`) - hashString(`${seed}:${b.id}`))
    .slice(0, take)
    .map((seat) => seat.id);
}

export function getBuses(from, to, date) {
  if (!isCity(from) || !isCity(to) || from === to || !date) return [];
  const base = routeMinutes(from, to);
  return OPERATORS.map((operator) => {
    const durationMin = Math.max(150, base + operator.offset);
    const arrival = clockFromMinutes(parseClock(operator.departure) + durationMin);
    const seats = flattenSeats(seatPlan(operator.layout));
    const seed = `${from}|${to}|${date}|${operator.id}`;
    const bookedSeats = pickBooked(seats, seed);
    const price = Math.max(349, Math.round((durationMin * 2.35 * operator.factor) / 10) * 10);
    return {
      id: operator.id,
      name: operator.name,
      type: operator.type,
      layout: operator.layout,
      rating: operator.rating,
      reviews: 420 + (hashString(seed) % 2600),
      amenities: operator.amenities,
      badge: operator.badge || "",
      from,
      to,
      date,
      departure: operator.departure,
      arrival: arrival.label,
      arrivalOffset: arrival.dayOffset,
      durationMin,
      durationLabel: formatDuration(durationMin),
      price,
      seatsTotal: seats.length,
      seatsAvailable: seats.length - bookedSeats.length,
      bookedSeats,
      ladiesSeats: seats.filter((seat) => seat.ladies).map((seat) => seat.id),
      boardingPoints: pointsFor(from),
      droppingPoints: pointsFor(to),
    };
  });
}

export function getBus(from, to, date, id) {
  return getBuses(from, to, date).find((bus) => bus.id === id) ?? null;
}
