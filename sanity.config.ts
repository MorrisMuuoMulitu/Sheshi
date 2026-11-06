import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { internationalizedArray } from "sanity-plugin-internationalized-array";
import { schemaTypes, structure } from "./schemaTypes";

const languages = [
  { id: "en", title: "English" },
  { id: "sw", title: "Kiswahili" },
];

export default defineConfig({
  name: "default",
  title: "EnviroHension",
  projectId: "i9s1a5ax",
  dataset: "production",

  plugins: [
    structureTool({ structure }),
    visionTool(),
    internationalizedArray({
      languages,
      defaultLanguages: ["en"],
      fieldTypes: ["string", "text"],
      languageFilter: {
        documentTypes: ["topic", "resource", "campaign", "workItem", "settings"],
      },
    }),
  ],

  schema: {
    types: schemaTypes,
  },
});
