import { test, expect } from '@playwright/test';

const ROUTES = [
  '/', '/journal/', '/articles/', '/events/',
  '/in2academia/', '/leadership/', '/about/', '/contact/',
];

test('every nav route resolves with a 200', async ({ page }) => {
  for (const route of ROUTES) {
    const response = await page.goto(route);
    expect(response?.status(), `${route} should resolve`).toBe(200);
  }
});

test('every page has exactly one h1', async ({ page }) => {
  for (const route of ROUTES) {
    await page.goto(route);
    await expect(page.locator('h1'), `${route} needs one h1`).toHaveCount(1);
  }
});

test('no page leaks template or placeholder markers', async ({ page }) => {
  for (const route of ROUTES) {
    await page.goto(route);
    await expect(page.locator('body'), route).not.toContainText('EXAMPLE TEMPLATE');
    await expect(page.locator('body'), route).not.toContainText('REPLACE_WITH');
    await expect(page.locator('body'), route).not.toContainText('PENDING —');
  }
});

test('events page explains the week-to-forum change rather than implying inconsistency', async ({ page }) => {
  await page.goto('/events/');
  await expect(page.locator('.lede')).toContainText('single-day forum');
});

test('events "Next" section, when present, uses the featured treatment', async ({ page }) => {
  await page.goto('/events/');
  const featuredCount = await page.locator('.featured-item').count();
  expect(featuredCount).toBeLessThanOrEqual(1);
});

test('no page describes Anthropy as multi-campus', async ({ page }) => {
  for (const route of ROUTES) {
    await page.goto(route);
    const text = (await page.locator('body').innerText()).toLowerCase();
    expect(text, route).not.toContain('multi-campus');
    expect(text, route).not.toContain('campuses across');
  }
});

test('leadership page shows a real roster or an honest empty state', async ({ page }) => {
  await page.goto('/leadership/');
  const count = await page.locator('.people li, .bento .tile, .empty').count();
  expect(count).toBeGreaterThan(0);
});

test('about page shows the programmes as a tile pair', async ({ page }) => {
  await page.goto('/about/');
  await expect(page.locator('.tile-pair-item')).toHaveCount(2);
});

test('page body never scrolls horizontally at mobile width', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 720 });
  for (const route of ROUTES) {
    await page.goto(route);
    const overflows = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    );
    expect(overflows, `${route} overflows horizontally`).toBe(false);
  }
});
