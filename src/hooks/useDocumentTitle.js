import { useEffect } from "react";

export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · Cedarline` : "Cedarline · Intercity coach tickets";
  }, [title]);
}
