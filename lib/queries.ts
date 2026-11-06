import { defineQuery } from "groq";

/**
 * One query per content page (PLAN.md Phase 3.2).
 * Typed by Sanity TypeGen (`npm run typegen` → sanity.types.ts).
 */

export const topicsQuery = defineQuery(
  `*[_type == "topic"] | order(order asc){
    key, title, intro, cardDescription, stepPill, level, icon, thumbClass,
    steps[]{ heading, body },
    resourceTitle, resourceDescription, order,
    videoFile{ asset->{ url } }, videoUrl,
    relatedResource->{ key, file{ asset->{ url } } }
  }`,
);

export const resourcesQuery = defineQuery(
  `*[_type == "resource"] | order(order asc){
    key, title, description, category, languages, order,
    file{ asset->{ url } }
  }`,
);

export const campaignsQuery = defineQuery(
  `*[_type == "campaign"] | order(order asc){
    key, icon, title, description, buttonLabel, tags, order,
    guide{ asset->{ url } },
    relatedTopic->{ key },
    relatedResource->{ key }
  }`,
);

export const workItemsQuery = defineQuery(
  `*[_type == "workItem"] | order(order asc){
    key, kind, title, badge, episodeNumber, meta, date, language, icon, order,
    mediaUrl
  }`,
);

/** Published community stories — shown on the Work page (Phase 4 gate). */
export const storiesQuery = defineQuery(
  `*[_type == "story" && status == "published"] | order(submittedAt desc){
    kind, title, titleSw, description, authorName, sourceUrl, submittedAt
  }`,
);

/** Site settings singleton (footer, socials, hero video — Phase 5). */
export const settingsQuery = defineQuery(
  `*[_type == "settings"][0]{
    siteName, tagline, contactEmail, phone, city,
    socials[]{ platform, icon, url },
    copyright, footerNote, heroVideoUrl, learnIntroVideoUrl,
    subscribeBlurb[]{ language, value }
  }`,
);
