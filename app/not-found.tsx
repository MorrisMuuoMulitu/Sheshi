import Link from "next/link";

/**
 * Global 404 — the URL has no locale segment, so the page stays
 * language-neutral (English) and offers both locales.
 */
export default function NotFound() {
  return (
    <div
      className="page"
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--gutter)",
        background: "var(--bg-brand)",
      }}
    >
      <div className="container container-narrow" style={{ textAlign: "center" }}>
        <p className="eyebrow eyebrow-plain">404</p>
        <h1 className="display-2" style={{ marginBottom: "var(--space-4)" }}>
          This page has not arrived yet.
        </h1>
        <p className="lede" style={{ marginInline: "auto", marginBottom: "var(--space-8)" }}>
          The page you are looking for may have moved, or it may not exist yet.
          Try the home page, or explore the modules, resources and campaigns.
        </p>
        <div className="cluster" style={{ justifyContent: "center" }}>
          <Link className="btn btn-primary btn-lg" href="/en">
            Back home
          </Link>
          <Link className="btn btn-secondary btn-lg" href="/sw">
            Nyumbani (Kiswahili)
          </Link>
        </div>
      </div>
    </div>
  );
}
