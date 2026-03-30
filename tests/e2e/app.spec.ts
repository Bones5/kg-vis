import { expect, test } from '@playwright/test';

test('renders graph controls', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('toolbar', { name: 'Graph controls' })).toBeVisible();
  await expect(page.getByRole('button', { name: /expand/i })).toBeVisible();
});
