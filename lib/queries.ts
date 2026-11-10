import { defineQuery } from "groq";

/**
 * One query per content page (PLAN.md Phase 3.2).
 * Typed by Sanity TypeGen (`npm run typegen` → sanity.types.ts).
 *
 * Every query selects `_id`: it is the only field that is guaranteed unique
 * per document. The human-authored `key` field can collide (the Studio lets
 * editors create documents that reuse an existing key), so `_id` is what the
 * app uses for React identity and the `key` is only used for content lookups.
 */

export const topicsQuery = defineQuery(
  `*[_type == "topic"] | order(order asc){
    _id, key, title, intro, cardDescription, stepPill, level, icon, thumbClass,
    steps[]{ heading, body },
    resourceTitle, resourceDescription, order,
    videoFile{ asset->{ url } }, videoUrl,
    relatedResource->{ key, file{ asset->{ url } } }
  }`,
);

export const resourcesQuery = defineQuery(
  `*[_type == "resource"] | order(order asc){
    _id, key, title, description, category, languages, order, _updatedAt,
    file{ asset->{ url } }
  }`,
);

export const campaignsQuery = defineQuery(
  `*[_type == "campaign"] | order(order asc){
    _id, key, icon, title, description, buttonLabel, tags, order,
    guide{ asset->{ url } },
    relatedTopic->{ key },
    relatedResource->{ key }
  }`,
);

export const workItemsQuery = defineQuery(
  `*[_type == "workItem"] | order(order asc){
    _id, key, kind, title, badge, episodeNumber, meta, date, language, icon, order,
    mediaUrl
  }`,
);

/** Published community stories — shown on the Work page (Phase 4 gate). */
export const storiesQuery = defineQuery(
  `*[_type == "story" && status == "published"] | order(submittedAt desc){
    _id, kind, title, titleSw, description, authorName, sourceUrl, submittedAt
  }`,
);

/** Site settings singleton (footer, socials, hero video — Phase 5). */
export const settingsQuery = defineQuery(
  `*[_type == "settings"][0]{
    siteName, tagline, contactEmail, phone, city,
    socials[]{ platform, icon, url },
    copyright, footerNote,
    heroVideo{ file{ asset->{ url } }, url },
    learnIntroVideo{ file{ asset->{ url } }, url },
    subscribeBlurb[]{ language, value }
  }`,
);
