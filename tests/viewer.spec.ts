import { test, expect } from "@playwright/test";

/**
 * The in-app viewer: files should open inside the site rather than being
 * downloaded. Downloads stay available as a secondary action.
 */

async function openFirstResource(page: import("@playwright/test").Page) {
  await page.goto("/en/build");
  const view = page.locator(".res-card .btn").first();
  await expect(view).toBeVisible();
  await view.click();
  return page.locator(".viewer");
}

test("a resource opens in the app instead of downloading", async ({ page }) => {
  const viewer = await openFirstResource(page);
  await expect(viewer).toBeVisible();
  await expect(viewer).toHaveAttribute("aria-modal", "true");

  // The PDF is rendered by the browser inside an iframe, not downloaded.
  const frame = viewer.locator(".viewer-pdf");
  await expect(frame).toHaveCount(1);
  await expect(frame).toHaveAttribute("src", /\.pdf/);

  // Download remains an option, but it is not the only path.
  await expect(viewer.getByRole("link", { name: /download/i })).toBeVisible();
});

test("the viewer covers the viewport and locks the page behind it", async ({ page }) => {
  const viewer = await openFirstResource(page);
  const box = await viewer.boundingBox();
  const vp = page.viewportSize()!;
  expect(box?.x).toBe(0);
  expect(box?.y).toBe(0);
  expect(Math.round(box!.width)).toBe(vp.width);

  expect(await page.evaluate(() => document.body.style.overflow)).toBe("hidden");
});

test("Escape closes the viewer and returns focus to the trigger", async ({ page }) => {
  await page.goto("/en/build");
  const view = page.locator(".res-card .btn").first();
  await view.click();
  await expect(page.locator(".viewer")).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(page.locator(".viewer")).toHaveCount(0);
  await expect(view).toBeFocused();
});

test("viewer chrome is usable on a phone", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const viewer = await openFirstResource(page);
  await expect(viewer).toBeVisible();

  // Full-screen sheet on mobile, and the close control is a real tap target.
  // `offsetWidth`/`offsetHeight` measure the layout box; boundingBox() would
  // also include the panel's entrance transform.
  const close = viewer.getByRole("button", { name: /close/i });
  const box = await close.evaluate((el) => ({
    w: (el as HTMLElement).offsetWidth,
    h: (el as HTMLElement).offsetHeight,
  }));
  expect(box.w).toBeGreaterThanOrEqual(44);
  expect(box.h).toBeGreaterThanOrEqual(44);
});

test("the mobile action bar only appears after the hero", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en");

  const bar = page.locator(".mobile-bar");
  await expect(bar).not.toHaveClass(/is-shown/);

  await page.evaluate(() => window.scrollTo(0, window.innerHeight));
  await expect(bar).toHaveClass(/is-shown/);

  // It must not cover the end of the page.
  const box = await bar.boundingBox();
  const vp = page.viewportSize()!;
  expect(Math.round(box!.y + box!.height)).toBe(vp.height);
});
