/**
 * Photograph credits.
 *
 * Every photo currently on the site comes from Wikimedia Commons under a
 * CC licence or a public-domain dedication, which requires attribution where
 * a licence says so. These are placeholders for the real thing: as soon as
 * Enviro-Hension supplies its own field photography, replace `public/img/*`
 * and delete the matching entry here.
 *
 * `usedOn` is informational — it keeps the trail from a photo to the page it
 * appears on, so nothing is credited that is no longer in use.
 */
export type Credit = {
  file: string;
  title: string;
  author: string;
  licence: string;
  licenceUrl: string;
  source: string;
  usedOn: string;
};

export const CREDITS: Credit[] = [
  {
    file: "hero-field.jpg",
    title: "Lolldaiga Conservancy, Kenya",
    author: "Nina R from Africa",
    licence: "CC BY 2.0",
    licenceUrl: "https://creativecommons.org/licenses/by/2.0/",
    source:
      "https://commons.wikimedia.org/wiki/File:Lolldaiga_Conservancy,_Kenya_(54279970100).jpg",
    usedOn: "Home — hero",
  },
  {
    file: "hills.jpg",
    title: "Ngong' Hills, Nairobi, Kenya",
    author: "Siegmund Kamau",
    licence: "CC BY-SA 3.0",
    licenceUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
    source: "https://commons.wikimedia.org/wiki/File:Ngong%27_Hills,_Nairobi,_Kenya.jpg",
    usedOn: "Learn — page header",
  },
  {
    file: "field-working.jpg",
    title: "Tea pickers working near Kericho, Kenya, 2012",
    author: "Josep M. Gracia",
    licence: "CC BY-SA 4.0",
    licenceUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    source:
      "https://commons.wikimedia.org/wiki/File:KER_-_Tea_pickers_working_near_Kericho,_Kenya,_2012.jpg",
    usedOn: "Home — Build pillar; Build — page header",
  },
  {
    file: "field-learning.jpg",
    title: "Green Talk",
    author: "NAIROBA",
    licence: "CC BY-SA 4.0",
    licenceUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "https://commons.wikimedia.org/wiki/File:Green_Talk.jpg",
    usedOn: "Home — Learn pillar",
  },
  {
    file: "field-planting.jpg",
    title: "Rachel the tireless tree planter, Kenya (photo 2)",
    author: "Caroletravis",
    licence: "CC BY-SA 4.0",
    licenceUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    source:
      "https://commons.wikimedia.org/wiki/File:Rachel_the_tireless_tree_planter,_Kenya_photo_2.jpg",
    usedOn: "Home — Act pillar; Act — page header",
  },
  {
    file: "band-tea.jpg",
    title: "Tea Farm in Kenya",
    author: "SeanTwice",
    licence: "CC0 1.0",
    licenceUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    source: "https://commons.wikimedia.org/wiki/File:Tea_Farm_in_Kenya.jpg",
    usedOn: "Home — impact band; Our Work — page header",
  },
];
