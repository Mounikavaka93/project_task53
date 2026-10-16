import { Link } from "react-router-dom";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { LinkButton } from "../components/ui/Button";

export default function NotFound() {
  useDocumentTitle("Page not found");
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
      <p className="text-xs font-semibold tracking-[0.16em] text-canopy uppercase">404</p>
      <h1 className="mt-3 font-serif text-4xl tracking-tight">That page is not on the route.</h1>
      <p className="mt-3 text-sm leading-6 text-muted">
        The link may be old. Search a trip from the home page, or <Link to="/search" className="font-semibold text-canopy">open search</Link>.
      </p>
      <LinkButton to="/" className="mt-6">
        Back home
      </LinkButton>
    </div>
  );
}
