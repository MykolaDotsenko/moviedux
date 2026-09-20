import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test("search, save and persistence form one complete flow", async ({ page }) => {
  await expect(
    page.getByRole("heading", { name: /find something worth watching/i }),
  ).toBeVisible();

  await page.getByLabel("Search by title").fill("Fury's Flight");
  const card = page.getByRole("article").filter({ hasText: "Fury's Flight" });
  await expect(card).toBeVisible();
  await card.getByRole("button", { name: "Add to watchlist" }).click();

  await page.getByRole("link", { name: /watchlist/i }).click();
  await expect(page.getByRole("heading", { name: "Fury's Flight" })).toBeVisible();

  await page.reload();
  await expect(page.getByRole("heading", { name: "Fury's Flight" })).toBeVisible();
});

test("the discover view has no accessibility violations", async ({ page }) => {
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test("mobile layout does not overflow horizontally", async ({ page }) => {
  const overflows = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(overflows).toBe(false);
});
