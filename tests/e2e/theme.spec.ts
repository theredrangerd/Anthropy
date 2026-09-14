import { test, expect } from '@playwright/test';

test('body paints an explicit background in light mode', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(bg).toBe('rgb(251, 249, 244)');
});

test('dark mode redefines the ground token', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(bg).toBe('rgb(16, 26, 38)');
});

test('explicit light theme beats a dark OS preference', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(bg).toBe('rgb(251, 249, 244)');
});

test('every token defined in light is also defined in dark', async ({ page }) => {
  const names = [
    '--c-ground', '--c-surface', '--c-sunk', '--c-ink', '--c-ink-soft',
    '--c-ink-faint', '--c-rule', '--c-sage', '--c-sage-soft', '--c-rust', '--c-rust-soft',
  ];
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  for (const name of names) {
    const value = await page.evaluate(
      (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim(),
      name,
    );
    expect(value, `${name} must resolve in dark mode`).toMatch(/^#[0-9A-Fa-f]{6}$/);
  }
});
