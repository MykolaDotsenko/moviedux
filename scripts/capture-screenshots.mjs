import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const baseUrl = process.env.SCREENSHOT_URL ?? "http://127.0.0.1:4173";
const outputDir = "docs/screenshots";

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch();

const waitForImages = async (page) => {
  await page.waitForFunction(() =>
    Array.from(document.images).every((image) => image.complete),
  );
};

const openPage = async (page, path, heading) => {
  await page.goto(new URL(path, baseUrl).toString(), { waitUntil: "domcontentloaded" });
  await page.getByRole("heading", { name: heading }).waitFor();
  await waitForImages(page);
};

try {
  const desktop = await browser.newContext({
    viewport: { width: 1440, height: 1200 },
    colorScheme: "dark",
    deviceScaleFactor: 1,
  });
  const desktopPage = await desktop.newPage();
  await openPage(desktopPage, "/", "Find something worth watching.");
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
  await openPage(mobilePage, "/", "Find something worth watching.");
  await mobilePage.getByRole("heading", { name: "Browse movies" }).scrollIntoViewIfNeeded();
  await mobilePage.screenshot({
    path: `${outputDir}/discover-mobile.png`,
    fullPage: false,
  });

  await mobilePage.evaluate(() => {
    localStorage.setItem("moviedux.watchlist.v1", JSON.stringify([1, 5, 9]));
  });
  await openPage(mobilePage, "/watchlist", "Your watchlist");
  await mobilePage.screenshot({
    path: `${outputDir}/watchlist-mobile.png`,
    fullPage: false,
  });
  await mobile.close();
} finally {
  await browser.close();
}
