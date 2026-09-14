import { test, expect } from '@playwright/test';

const NAV = ['Journal', 'Articles', 'Events', 'In2Academia', 'Leadership', 'About', 'Contact'];

test('primary nav lists every section in audience-priority order', async ({ page }) => {
  await page.goto('/');
  const labels = await page.locator('nav[aria-label="Primary"] a').allTextContents();
  expect(labels.map((l) => l.trim())).toEqual(NAV);
});

test('footer shows the tagline and does not render placeholder contact details', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.tagline')).toContainText('intellectual curiosity');
  await expect(page.locator('footer')).not.toContainText('REPLACE_WITH');
});

test('skip link is the first focusable element', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.locator(':focus')).toHaveText('Skip to content');
});

test('page has a canonical url', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://anthropy.wetkarma.com/',
  );
});
