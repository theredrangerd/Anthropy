import { test, expect } from '@playwright/test';

test('leads with the thesis, not an invitation to join', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('prepare the people who will');
});

test('proof band is absent while alumni data is empty', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.proof')).toHaveCount(0);
});

test('empty collections render an intentional message, not a broken grid', async ({ page }) => {
  await page.goto('/');
  const empties = page.locator('.empty');
  await expect(empties.first()).toBeVisible();
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
