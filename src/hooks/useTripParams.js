import { useSearchParams } from "react-router-dom";

export function useTripParams() {
  const [params] = useSearchParams();
  return {
    from: params.get("from")?.trim() || "",
    to: params.get("to")?.trim() || "",
    date: params.get("date")?.trim() || "",
  };
}
