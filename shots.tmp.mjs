import { chromium } from "@playwright/test";
const out = "/tmp/opencode/shots";
const BASE = "http://localhost:3002";
const b = await chromium.launch();
async function shoot(ctx, name, path, scroll = true) {
  const page = await ctx.newPage();
  await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
  if (scroll) {
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.4;
      for (let y = 0; y < document.body.scrollHeight + window.innerHeight; y += step) {
        window.scrollTo(0, y); await new Promise(r => setTimeout(r, 110));
      }
      window.scrollTo(0, 0); await new Promise(r => setTimeout(r, 400));
    });
  }
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${out}/${name}.png`, fullPage: true });
  console.log("shot", name);
}
const ctx = await b.newContext({ viewport: { width: 1440, height: 1000 } });
await shoot(ctx, "u-home", "/en");
await shoot(ctx, "u-build", "/en/build");
const mctx = await b.newContext({ viewport: { width: 390, height: 844 } });
const mp = await mctx.newPage();
await mp.goto(`${BASE}/en`, { waitUntil: "networkidle" });
await mp.evaluate(() => window.scrollTo(0, 1400));
await mp.waitForTimeout(800);
await mp.screenshot({ path: `${out}/u-m-bar.png` });
console.log("shot u-m-bar (mobile, scrolled: action bar)");
await b.close();
