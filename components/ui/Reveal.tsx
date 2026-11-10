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
    // Safety net: if the observer misses an element that is already close to
    // the viewport (fast scroll, layout shift, a browser quirk), reveal it
    // rather than leave a blank gap. Elements far below stay hidden until the
    // reader actually scrolls to them — that is the point of the effect.
    const fallback = window.setTimeout(() => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 1.5) {
        el.classList.add("is-visible");
        obs.unobserve(el);
      }
    }, 2500);
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
