import { test, expect } from "@playwright/test";

/**
 * Coverage for the CMS wiring: everything an editor publishes must actually
 * reach the page. These assertions are deliberately loose about *which*
 * documents exist (the dataset changes) but strict that the page renders
 * whatever the dataset returns.
 */

type Counts = { topics: number; resources: number };

/**
 * Ask the app to drop its own cache, exactly as the Sanity webhook does.
 * Without this the prerendered page can lag the dataset by a build.
 */
async function revalidate(request: import("@playwright/test").APIRequestContext) {
  const secret = process.env.REVALIDATE_SECRET;
  test.skip(!secret, "REVALIDATE_SECRET not set in the test environment");
  const res = await request.post("/api/revalidate", {
    headers: { "x-revalidate-secret": secret as string },
    data: {},
  });
  expect(res.ok(), "revalidate endpoint accepted the secret").toBeTruthy();
}

async function datasetCounts(request: import("@playwright/test").APIRequestContext): Promise<Counts> {
  const project = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "i9s1a5ax";
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
  const url = `https://${project}.api.sanity.io/v2024-01-01/data/query/${dataset}`;
  const q = encodeURIComponent(
    `{"topics": count(*[_type=="topic"]), "resources": count(*[_type=="resource"])}`,
  );
  const res = await request.get(`${url}?query=${q}`);
  expect(res.ok()).toBeTruthy();
  const body = (await res.json()) as { result: Counts };
  return body.result;
}

test("every module in the dataset renders on the Learn page", async ({ page, request }) => {
  const { topics } = await datasetCounts(request);
  test.skip(topics === 0, "dataset has no topics");

  await revalidate(request);
  await page.goto("/en/learn");
  // The grid shows every topic; the count must match the dataset exactly —
  // a silent dedupe here is what previously hid a published module.
  await expect(page.locator(".topic-card")).toHaveCount(topics);
});

test("every resource in the dataset renders on the Build page", async ({ page, request }) => {
  const { resources } = await datasetCounts(request);
  test.skip(resources === 0, "dataset has no resources");

  await revalidate(request);
  await page.goto("/en/build");
  await expect(page.locator(".res-card")).toHaveCount(resources);
});

test("the home page shows real modules and resources, not placeholders", async ({ page, request }) => {
  const { topics, resources } = await datasetCounts(request);
  test.skip(topics === 0 || resources === 0, "dataset is empty");
  expect(resources).toBeGreaterThan(0);

  await revalidate(request);
  await page.goto("/en");
  // Featured modules come from the CMS.
  const modules = page.locator("#h-mod-title");
  await expect(modules).toBeVisible();
  expect(await page.locator(".topic-grid .topic-card").count()).toBeGreaterThan(0);
  // Latest resources come from the CMS.
  await expect(page.locator("#h-res-title")).toBeVisible();
  expect(await page.locator(".res-list .res-row").count()).toBeGreaterThan(0);
});

test("home page stats match the dataset", async ({ page, request }) => {
  const { topics, resources } = await datasetCounts(request);
  test.skip(topics === 0, "dataset is empty");

  await revalidate(request);
  await page.goto("/en");
  const stats = await page.locator(".hero-stat b").allInnerTexts();
  expect(stats).toContain(String(topics));
  expect(stats).toContain(String(resources));
});

test("draft-mode endpoint rejects a wrong secret", async ({ request }) => {
  const res = await request.get("/api/draft-mode/enable?secret=definitely-wrong", {
    maxRedirects: 0,
  });
  expect([401, 500]).toContain(res.status());
});

test("draft-mode endpoint redirects with the correct secret", async ({ request }) => {
  const secret = process.env.SANITY_PREVIEW_SECRET;
  test.skip(!secret, "SANITY_PREVIEW_SECRET not set in the test environment");

  const res = await request.get(
    `/api/draft-mode/enable?secret=${encodeURIComponent(secret as string)}&sanity-preview-pathname=/en/learn`,
    { maxRedirects: 0 },
  );
  expect(res.status()).toBe(307);
  expect(res.headers()["location"]).toContain("/en/learn");
});
