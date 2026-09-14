import { test, expect } from '@playwright/test';

test('journal index renders with an intentional empty state', async ({ page }) => {
  await page.goto('/journal/');
  await expect(page.locator('h1')).toContainText('Academic Journal');
  await expect(page.locator('.empty')).toBeVisible();
});

test('articles index renders with an intentional empty state', async ({ page }) => {
  await page.goto('/articles/');
  await expect(page.locator('h1')).toHaveText('Articles');
  await expect(page.locator('.empty')).toBeVisible();
});

test('draft seed content is not published as a route', async ({ page }) => {
  const response = await page.goto('/articles/example-article/');
  expect(response?.status()).toBe(404);
});

test('publication pages never leak template markers', async ({ page }) => {
  for (const path of ['/journal/', '/articles/']) {
    await page.goto(path);
    await expect(page.locator('body')).not.toContainText('EXAMPLE TEMPLATE');
  }
});
