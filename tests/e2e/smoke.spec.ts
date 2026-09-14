import { test, expect } from '@playwright/test';

test('homepage builds and serves', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toHaveText('Anthropy');
});
