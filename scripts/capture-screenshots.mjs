import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { env } from "node:process";
import { URL } from "node:url";

const baseUrl = env.SCREENSHOT_URL ?? "http://127.0.0.1:4173";
const outputDir = "docs/screenshots";

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch();

const openPage = async (page, path, heading) => {
  await page.goto(new URL(path, baseUrl).toString(), { waitUntil: "domcontentloaded" });
  await page.getByRole("heading", { name: heading }).waitFor();
};

const settleVisiblePosters = async (page) => {
  const firstPoster = page.locator(".movie-poster").first();
  await firstPoster.waitFor({ state: "visible" });
  await firstPoster.evaluate((image) => {
    if (image instanceof globalThis.HTMLImageElement && !image.complete) {
      return new Promise((resolve) => {
        image.addEventListener("load", resolve, { once: true });
        image.addEventListener("error", resolve, { once: true });
      });
    }
  });
  await page.waitForTimeout(250);
};

try {
  const desktop = await browser.newContext({
    viewport: { width: 1440, height: 1200 },
    colorScheme: "dark",
    deviceScaleFactor: 1,
  });

  const page = await desktop.newPage();
  await openPage(page, "/", "Find something worth watching.");
  await settleVisiblePosters(page);
  await page.screenshot({
    path: `${outputDir}/discover-desktop.png`,
    fullPage: false,
  });

  await desktop.close();
} finally {
  await browser.close();
}
