import Image from "next/image";
import type { ReactNode } from "react";

/**
 * Shared page header for Learn / Build / Act / Work / Contact.
 *
 * A dark photographic band so inner pages carry the same visual language as
 * the home hero. When `image` is omitted it falls back to the solid forest
 * surface, so a missing asset never leaves a broken-looking page.
 */
export default function PageHead({
  eyebrow,
  title,
  lede,
  image,
  imageAlt = "",
  children,
  id,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  image?: string;
  imageAlt?: string;
  children?: ReactNode;
  /** id for the h1, referenced by aria-labelledby where needed */
  id?: string;
}) {
  return (
    <section className={`page-head${image ? " page-head-photo" : ""}`}>
      {image && (
        <>
          <Image
            src={image}
            alt={imageAlt}
            fill
            priority
            sizes="100vw"
            className="page-head-img"
          />
          <div className="page-head-scrim" aria-hidden="true" />
        </>
      )}
      <div className="container">
        <p className="eyebrow">{eyebrow}</p>
        <h1 id={id}>{title}</h1>
        {lede && <p>{lede}</p>}
        {children}
      </div>
    </section>
  );
}
