import { defineQuery } from "groq";

/**
 * One query per content page (PLAN.md Phase 3.2).
 * Typed by Sanity TypeGen (`npm run typegen` → sanity.types.ts).
 */

export const topicsQuery = defineQuery(
  `*[_type == "topic"] | order(order asc){
    key, title, intro, cardDescription, stepPill, level, icon, thumbClass,
    steps[]{ heading, body },
    resourceTitle, resourceDescription, order
  }`,
);

export const resourcesQuery = defineQuery(
  `*[_type == "resource"] | order(order asc){
    key, title, description, category, languages, order
  }`,
);

export const campaignsQuery = defineQuery(
  `*[_type == "campaign"] | order(order asc){
    key, icon, title, description, buttonLabel, tags, order
  }`,
);

export const workItemsQuery = defineQuery(
  `*[_type == "workItem"] | order(order asc){
    key, kind, title, badge, episodeNumber, meta, date, language, icon, order
  }`,
);
