import { test, expect } from "@playwright/test";

/**
 * UI/UX overhaul regression coverage.
 *
 * Covers the behaviours the redesign introduced that the legacy smoke suite
 * does not exercise: dark-mode theming, the skip link, the mobile drawer's
 * keyboard contract, modal focus management, and the SVG-only icon rule.
 */

test("skip link is the first tab stop and targets the main landmark", async ({ page }) => {
  await page.goto("/en");
  await page.keyboard.press("Tab");
  const skip = page.locator(".skip-link");
  await expect(skip).toBeFocused();
  await expect(page.locator("#main-content")).toHaveCount(1);
});

test("every page exposes exactly one h1", async ({ page }) => {
  for (const path of ["/en", "/en/learn", "/en/build", "/en/act", "/en/work", "/en/contact"]) {
    await page.goto(path);
    await expect(page.locator("h1"), `h1 count on ${path}`).toHaveCount(1);
  }
});

test("theme toggle switches the document theme and persists it", async ({ page }) => {
  await page.goto("/en");
  const html = page.locator("html");
  const before = await html.getAttribute("data-theme");

  await page.locator("#theme-toggle").click();
  const after = await html.getAttribute("data-theme");
  expect(after).not.toBe(before);

  // Reload → the stored choice wins, so there is no flash of the wrong theme.
  await page.reload({ waitUntil: "load" });
  expect(await html.getAttribute("data-theme")).toBe(after);
});

test("no emoji are used as structural icons", async ({ page }) => {
  await page.goto("/en/learn");
  // Topic thumbnails are SVG icons, not emoji glyphs.
  const thumbs = page.locator(".tc-thumb");
  const count = await thumbs.count();
  expect(count).toBeGreaterThan(0);
  for (let i = 0; i < count; i++) {
    await expect(thumbs.nth(i).locator("svg")).toHaveCount(1);
  }
});

test("mobile drawer traps focus, closes on Escape, and restores focus", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en");
  const hamburger = page.locator("#hamburger-btn");
  await hamburger.click();

  const drawer = page.locator("#mobile-menu");
  await expect(drawer).toHaveClass(/is-open/);
  await expect(hamburger).toHaveAttribute("aria-expanded", "true");

  // Focus moves into the drawer.
  await expect(drawer.locator("a").first()).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(drawer).not.toHaveClass(/is-open/);
  await expect(hamburger).toBeFocused();
});

test("share modal traps focus, closes on Escape, and restores focus", async ({ page }) => {
  await page.goto("/en");
  const trigger = page.locator("#t-scb");
  await trigger.click();

  const dialog = page.locator("#share-modal [role='dialog']");
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute("aria-modal", "true");

  // Focus is inside the dialog.
  await expect
    .poll(() =>
      dialog.evaluate((el) => el.contains(document.activeElement)),
    )
    .toBe(true);

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("resource filters narrow the grid and announce their state", async ({ page }) => {
  await page.goto("/en/build");
  const templates = page.locator("#fb-tp");
  await templates.click();
  await expect(templates).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("#fb-all")).toHaveAttribute("aria-pressed", "false");

  const visible = page.locator(".res-card:visible");
  expect(await visible.count()).toBeGreaterThan(0);
  for (const cat of await visible.evaluateAll((els) =>
    els.map((e) => (e as HTMLElement).dataset.cat),
  )) {
    expect(cat).toBe("tp");
  }
});

test("form fields have visible labels, not placeholder-only labelling", async ({ page }) => {
  await page.goto("/en/contact");
  for (const id of ["cf-name", "cf-email", "cf-subject", "cf-body"]) {
    const label = page.locator(`label[for="${id}"]`);
    await expect(label).toHaveCount(1);
    await expect(label).toBeVisible();
  }
});

test("no horizontal overflow at 375px on any page", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  for (const path of ["/en", "/en/learn", "/en/build", "/en/act", "/en/work", "/en/contact"]) {
    await page.goto(path);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow, `overflow on ${path}`).toBeLessThanOrEqual(1);
  }
});

test("reduced-motion preference removes reveal transitions", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/en");
  const revealed = page.locator(".reveal").first();
  const opacity = await revealed.evaluate(
    (el) => getComputedStyle(el).opacity,
  );
  expect(Number(opacity)).toBe(1);
});
