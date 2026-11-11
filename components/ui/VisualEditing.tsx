"use client";

import { VisualEditing as SanityVisualEditing } from "@sanity/visual-editing/react";

/**
 * Click-to-edit overlay for Sanity Presentation.
 *
 * Rendered only inside Next draft mode. When the page is embedded in the
 * Studio's preview pane it highlights the element under the cursor and jumps
 * the Studio to the matching field on click. Outside the Studio it renders
 * nothing and costs nothing.
 *
 * The mapping works because `previewClient` (lib/sanity.ts) stega-encodes the
 * strings it returns.
 */
export default function VisualEditing() {
  // `portal` wraps the overlay in a portal on document.body so it is not
  // affected by the app's stacking contexts or `overflow: hidden` sections.
  return <SanityVisualEditing portal />;
}
