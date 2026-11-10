/**
 * Loading placeholder.
 *
 * A shimmer sweep rather than a spinner: it reserves the exact space the
 * content will occupy, so the swap into real content does not shift the
 * layout (ui-ux-pro-max §3 `content-jumping`, `loading-states`).
 */
export function Skeleton({ className = "" }: { className?: string }) {
  return <span className={`skeleton ${className}`.trim()} aria-hidden="true" />;
}
