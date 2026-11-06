/* One-off verification: doc counts + bilingual sample from the dataset. */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createClient } from "@sanity/client";

const cfg = JSON.parse(
  fs.readFileSync(path.join(os.homedir(), ".config", "sanity", "config.json"), "utf8"),
) as Record<string, string>;

const client = createClient({
  projectId: "i9s1a5ax",
  dataset: "production",
  apiVersion: "2026-11-06",
  token: cfg.authToken,
  useCdn: false,
});

const q = `{
  "counts": {
    "topic": count(*[_type == "topic"]),
    "resource": count(*[_type == "resource"]),
    "campaign": count(*[_type == "campaign"]),
    "workItem": count(*[_type == "workItem"]),
    "settings": count(*[_type == "settings"])
  },
  "river": *[_type == "topic" && key == "river"][0]{
    title, "stepCount": length(steps), level, cardDescription, stepPill
  },
  "resource3": *[_type == "resource" && key == "r3"][0]{title, category, languages}
}`;

async function main() {
  const r = await client.fetch(q);
  console.log(JSON.stringify(r, null, 1));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
