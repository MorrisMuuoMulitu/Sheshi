import type { StructureBuilder } from "sanity/structure";

/**
 * Desk structure: Content / Submissions / Settings (PLAN.md Phase 2.1).
 */
export function structure(S: StructureBuilder) {
  return S.list()
    .title("Enviro-Hension")
    .items([
      S.listItem()
        .title("Content")
        .id("content")
        .child(
          S.list()
            .title("Content")
            .items([
              S.documentTypeListItem("topic").title("🎓 Topics").schemaType("topic"),
              S.documentTypeListItem("resource").title("📦 Resources"),
              S.documentTypeListItem("campaign").title("📣 Campaigns"),
              S.documentTypeListItem("workItem").title("🎬 Work Items"),
            ]),
        ),
      S.listItem()
        .title("Submissions")
        .id("submissions")
        .child(
          S.list()
            .title("Submissions")
            .items([
              S.documentTypeListItem("event").title("📅 Events"),
              S.documentTypeListItem("story").title("📖 Stories"),
              S.documentTypeListItem("message").title("✉️ Messages"),
            ]),
        ),
      S.divider(),
      S.listItem()
        .title("⚙️ Settings")
        .id("settings")
        .child(S.document().schemaType("settings").documentId("settings")),
    ]);
}
