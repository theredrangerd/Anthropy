import { test, expect } from '@playwright/test';

test('homepage builds and serves', async ({ page }) => {
  const response = await page.goto('/');
  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle(/Anthropy/);
  await expect(page.locator('h1')).not.toBeEmpty();
});
