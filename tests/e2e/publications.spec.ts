import { test, expect } from '@playwright/test';

test('journal index renders content or an honest empty state', async ({ page }) => {
  await page.goto('/journal/');
  await expect(page.locator('h1')).toContainText('Academic Journal');
  const count = await page.locator('.grid li, .empty').count();
  expect(count).toBeGreaterThan(0);
});

test('journal index features the latest issue or an honest empty state', async ({ page }) => {
  await page.goto('/journal/');
  const count = await page.locator('.featured-item, .empty').count();
  expect(count).toBeGreaterThan(0);
});

test('articles index renders content or an honest empty state', async ({ page }) => {
  await page.goto('/articles/');
  await expect(page.locator('h1')).toHaveText('Articles');
  const count = await page.locator('.grid li, .empty').count();
  expect(count).toBeGreaterThan(0);
});

test('articles index features the latest paper or an honest empty state', async ({ page }) => {
  await page.goto('/articles/');
  const count = await page.locator('.featured-item, .empty').count();
  expect(count).toBeGreaterThan(0);
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
