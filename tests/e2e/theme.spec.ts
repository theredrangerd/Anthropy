import { test, expect } from '@playwright/test';

test('body paints an explicit light background', async ({ page }) => {
  await page.goto('/');
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(bg).toBe('rgb(255, 255, 255)');
});

test('a dark OS preference does not change the theme', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(bg).toBe('rgb(255, 255, 255)');
});
