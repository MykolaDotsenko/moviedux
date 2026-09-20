import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const baseUrl = process.env.SCREENSHOT_URL ?? "http://127.0.0.1:4173";
const outputDir = "docs/screenshots";

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch();

const waitForPage = async (page, path = "/") => {
  await page.goto(new URL(path, baseUrl).toString(), { waitUntil: "networkidle" });
  await page.waitForFunction(() =>
    Array.from(document.images).every((image) => image.complete),
  );
};

try {
  const desktop = await browser.newContext({
    viewport: { width: 1440, height: 1200 },
    colorScheme: "dark",
    deviceScaleFactor: 1,
  });
  const desktopPage = await desktop.newPage();
  await waitForPage(desktopPage);
  await desktopPage.screenshot({
    path: `${outputDir}/discover-desktop.png`,
    fullPage: false,
  });
  await desktop.close();

  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    colorScheme: "dark",
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true,
  });
  const mobilePage = await mobile.newPage();
  await waitForPage(mobilePage);
  await mobilePage.getByRole("heading", { name: "Browse movies" }).scrollIntoViewIfNeeded();
  await mobilePage.screenshot({
    path: `${outputDir}/discover-mobile.png`,
    fullPage: false,
  });

  await mobilePage.evaluate(() => {
    localStorage.setItem("moviedux.watchlist.v1", JSON.stringify([1, 5, 9]));
  });
  await waitForPage(mobilePage, "/watchlist");
  await mobilePage.screenshot({
    path: `${outputDir}/watchlist-mobile.png`,
    fullPage: false,
  });
  await mobile.close();
} finally {
  await browser.close();
}
