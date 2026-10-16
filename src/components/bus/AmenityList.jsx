import { Armchair, BedDouble, GlassWater, Lamp, Moon, Plug, Sparkles, Wind } from "lucide-react";

const ICONS = {
  Blanket: BedDouble,
  "Charging point": Plug,
  "Water bottle": GlassWater,
  "Reading light": Lamp,
  "Eye mask": Moon,
  Recliner: Armchair,
  "Extra legroom": Armchair,
  "Openable windows": Wind,
};

export default function AmenityList({ items }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => {
        const Icon = ICONS[item] || Sparkles;
        return (
          <li key={item} className="inline-flex items-center gap-1.5 rounded-full bg-paper px-2.5 py-1 text-xs text-muted">
            <Icon className="h-3.5 w-3.5 text-canopy" aria-hidden />
            {item}
          </li>
        );
      })}
    </ul>
  );
}
