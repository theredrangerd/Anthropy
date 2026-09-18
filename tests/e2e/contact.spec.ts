import { test, expect } from '@playwright/test';

test('contact email, when configured, is styled larger than body text', async ({ page }) => {
  await page.goto('/contact/');
  const hasEmail = await page.locator('.email').count();
  test.skip(hasEmail === 0, 'contact email not configured in site.json yet');
  const emailSize = await page.locator('.email').evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
  const bodySize = await page.evaluate(() => parseFloat(getComputedStyle(document.body).fontSize));
  expect(emailSize).toBeGreaterThan(bodySize * 1.5);
});

test('contact page falls back to an honest empty state when no email is configured', async ({ page }) => {
  await page.goto('/contact/');
  const hasEmail = await page.locator('.email').count();
  test.skip(hasEmail > 0, 'contact email is configured');
  await expect(page.locator('.empty')).toContainText('being finalised');
});
