import { test, expect } from '@playwright/test';

test('final text is correct without the animation having run', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.lede')).toContainText('learning to do research');
  await expect(page.locator('.lede')).not.toContainText('just interested in');
});

test('the effect is contained to two placements site-wide', async ({ page }) => {
  const routes = ['/', '/journal/', '/articles/', '/events/', '/in2academia/', '/leadership/', '/about/', '/contact/'];
  let total = 0;
  for (const route of routes) {
    await page.goto(route);
    total += await page.locator('[data-revision]').count();
  }
  expect(total).toBe(2);
});

test('the draft text is inserted only when motion is allowed', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  // Assert on textContent rather than toHaveText: the collapse animation ends at
  // max-width 0, giving a zero bounding box, so a visibility-aware matcher would
  // race the animation and flake.
  await expect
    .poll(async () =>
      page.locator('.lede .struck').evaluate((el) => el.textContent?.trim()),
    )
    .toBe('just interested in');
});

test('about page states what Anthropy is not', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/about/');
  await expect(page.locator('.prose')).toContainText('not a think tank');
});
