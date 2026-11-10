"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

/**
 * Scroll-reveal wrapper.
 *
 * Adds `.is-visible` once the element scrolls into view. The CSS starts the
 * element hidden and transitions it in, so no layout shift and no flash of
 * unstyled content. Under `prefers-reduced-motion` the CSS pins it visible.
 *
 * A single shared IntersectionObserver is used for every instance on the page.
 */
let observer: IntersectionObserver | null = null;

function getObserver() {
  if (observer || typeof IntersectionObserver === "undefined") return observer;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer?.unobserve(entry.target);
        }
      }
    },
    { rootMargin: "0px 0px 200px 0px", threshold: 0 },
  );
  return observer;
}

export default function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  className = "",
  style,
}: {
  children: ReactNode;
  as?: ElementType;
  /** 0–6, maps to the staggered reveal delays in base.css. */
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = getObserver();
    if (!obs) {
      el.classList.add("is-visible");
      return;
    }
    obs.observe(el);
    // Safety net: the content must never be able to stay invisible. If the
    // observer has not fired within 3s — background tab, print, a browser
    // quirk, a fast scroll that skipped the element — reveal it anyway.
    // Losing the animation is acceptable; losing the content is not.
    const fallback = window.setTimeout(() => {
      el.classList.add("is-visible");
      obs.unobserve(el);
    }, 3000);
    return () => {
      window.clearTimeout(fallback);
      obs.unobserve(el);
    };
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`.trim()}
      data-delay={delay || undefined}
      style={style}
    >
      {children}
    </Tag>
  );
}
