import { defineField } from "sanity";

/**
 * Bilingual field helpers backed by `sanity-plugin-internationalized-array`
 * (registered in sanity.config.ts for the `en`/`sw` language pair).
 *
 * Values are arrays of `{_key, language, value}`; readers should fall back to
 * English when the requested locale's item is missing (PLAN.md D4).
 */

type BiKind = "string" | "text";

export function bi(name: string, title: string, kind: BiKind = "string", extra: Record<string, unknown> = {}) {
  return defineField({
    name,
    title,
    type: kind === "text" ? "internationalizedArrayText" : "internationalizedArrayString",
    ...extra,
  });
}

type BiItem = { language?: string; value?: string };

/** Pick the English value from an internationalized array (fallback: first non-empty). */
export function pickLang(v?: BiItem[] | BiItem): string {
  if (!v || typeof v !== "object") return "";
  const arr = Array.isArray(v) ? v : [v];
  const en = arr.find((x) => x?.language === "en" && x?.value);
  if (en?.value) return en.value;
  return arr.find((x) => x?.value)?.value ?? "";
}

/** Preview `prepare` for documents whose main title is a bilingual field. */
export function bilingualTitle(selectTitle = "title") {
  return {
    select: { [selectTitle]: selectTitle, subtitle: "key" },
    prepare({ ...s }: Record<string, unknown>) {
      const title = pickLang(s[selectTitle] as BiItem[]);
      const subtitle = typeof s.subtitle === "string" ? s.subtitle : "";
      return { title: title || "(untitled)", subtitle };
    },
  };
}
