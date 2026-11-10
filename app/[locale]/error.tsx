"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

/**
 * Route-level error boundary.
 *
 * Shows a recoverable state instead of a blank page, and logs the error so
 * it reaches the server logs. The retry button re-renders the segment.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[eh] route error:", error);
  }, [error]);

  return (
    <div
      className="page"
      style={{
        minHeight: "60dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--gutter)",
      }}
    >
      <div className="container container-narrow" style={{ textAlign: "center" }}>
        <span className="icon-tile" style={{ marginBottom: "var(--space-4)" }}>
          <AlertCircle size={24} aria-hidden="true" />
        </span>
        <h1 className="display-3" style={{ marginBottom: "var(--space-3)" }}>
          Something went wrong
        </h1>
        <p className="lede" style={{ marginInline: "auto", marginBottom: "var(--space-8)" }}>
          We could not load this page. Please try again — if the problem
          continues, get in touch and we will help.
        </p>
        <div className="cluster" style={{ justifyContent: "center" }}>
          <button type="button" className="btn btn-primary btn-lg" onClick={() => reset()}>
            Try again
          </button>
          <Link className="btn btn-secondary btn-lg" href="/en">
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}
