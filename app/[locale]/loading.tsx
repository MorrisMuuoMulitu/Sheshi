import { Skeleton } from "@/components/ui/Skeleton";

/**
 * Route-level loading skeleton.
 *
 * The pages read from the CMS cache, so a slow Sanity fetch would otherwise
 * leave a blank screen. The skeleton mirrors the page-head + grid layout so
 * the transition into content does not shift the layout (CLS).
 */
export default function Loading() {
  return (
    <div className="page" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading…</span>
      <div className="page-head">
        <div className="container">
          <Skeleton className="skeleton-eyebrow" />
          <Skeleton className="skeleton-title" />
          <Skeleton className="skeleton-text" />
        </div>
      </div>
      <div className="container section">
        <div className="topic-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div className="topic-card" key={i} aria-hidden="true">
              <Skeleton className="skeleton-thumb" />
              <div className="tc-body">
                <Skeleton className="skeleton-line" />
                <Skeleton className="skeleton-line skeleton-line-sm" />
                <Skeleton className="skeleton-line skeleton-line-xs" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
