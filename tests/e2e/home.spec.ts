import { test, expect } from '@playwright/test';

test('leads with the thesis, not an invitation to join', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('prepare the people who will');
});

test('proof band is absent while alumni data is empty', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.proof')).toHaveCount(0);
});

test('recent work and journal sections render content or an honest empty state', async ({ page }) => {
  await page.goto('/');
  const count = await page.locator('.grid li, .empty').count();
  expect(count).toBeGreaterThan(0);
});

test('hero is not squashed into a narrow column', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/');
  const width = await page.locator('.lede').evaluate((el) => el.getBoundingClientRect().width);
  expect(width).toBeGreaterThan(400);
});

test('no placeholder markers leak into the rendered page', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('body')).not.toContainText('EXAMPLE TEMPLATE');
  await expect(page.locator('body')).not.toContainText('REPLACE_WITH');
});

test('programmes are shown as a featured tile pair', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.tile-pair-item')).toHaveCount(2);
});

test('homepage closes with a stat strip that never shows a bare zero', async ({ page }) => {
  await page.goto('/');
  const values = await page.locator('.fact-strip .value').allTextContents();
  for (const v of values) expect(v.trim()).not.toBe('0');
});
