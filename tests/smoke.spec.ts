import { test, expect } from "@playwright/test";

/**
 * Smoke coverage for the live-rendered app (PLAN.md Phase 7.3):
 *  - navigation works between pages and locales
 *  - CMS content is rendered (seeded Sanity data)
 *  - the contact form submits through the API and shows its success state
 *    (network is mocked — no documents are created by CI)
 */

test("nav: home → Learn → locale switch keeps the page", async ({ page }) => {
  await page.goto("/en");
  await expect(page.locator("#main-nav")).toBeVisible();
  await page.locator("#nl-learn").click();
  await expect(page).toHaveURL(/\/en\/learn$/);
  await expect(page.locator("#t-lh:visible")).toHaveText("Choose What to Learn");

  // Locale switch preserves the route.
  await page.locator("#lb-sw").click();
  await expect(page).toHaveURL(/\/sw\/learn$/);
  await expect(page.locator("#t-lh:visible")).toHaveText("Chagua Unachotaka Kujifunza");
});

test("CMS content renders from Sanity (en + sw)", async ({ page }) => {
  await page.goto("/en/build");
  // Seeded resource from the CMS; hidden until the Sanity fallback is used.
  await expect(page.getByText("Event Planning Checklist", { exact: true })).toBeVisible();
  // Resource cards download a real Sanity file.
  await expect(page.locator(".res-card a.dl-btn").first()).toHaveAttribute(
    "href",
    /cdn\.sanity\.io/,
  );

  await page.goto("/sw/act");
  await expect(page.getByText("Kampeni ya Kusafisha Mto", { exact: true })).toBeVisible();
});

test("contact form submits and shows the success state (mocked API)", async ({
  page,
}) => {
  let posted = false;
  await page.route("**/api/contact", async (route) => {
    posted = true;
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true }),
    });
  });

  await page.goto("/en/contact");
  await page.locator("#cf-name").fill("CI Tester");
  await page.locator("#cf-email").fill("ci@example.com");
  await page.locator("#cf-subject").fill("Smoke test");
  await page.locator("#cf-body").fill("Hello from the Playwright smoke suite.");
  await page.locator("#t-cfb").click();

  await expect(page.locator("#t-cfb")).toContainText("Message Sent");
  await expect(page.getByText("Thanks! We'll get back to you soon.")).toBeVisible();
  expect(posted).toBe(true);
});

test("mobile: hamburger opens the drawer and pages do not overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en");
  await page.locator("#hamburger-btn").click();
  await expect(page.locator("#mobile-menu")).toHaveClass(/open/);
  await expect(page.locator("#mn-build")).toBeVisible();
  await page.locator("#mn-build").click();
  await expect(page).toHaveURL(/\/en\/build$/);

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});
