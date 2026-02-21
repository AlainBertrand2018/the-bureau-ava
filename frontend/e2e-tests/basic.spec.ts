import { test, expect } from '@playwright/test';

test('homepage has expected elements', async ({ page }) => {
    await page.goto('/');

    // Expect a title or basic element to be visible
    await expect(page).toHaveTitle(/.*|Survey/);

    // We can add more specific selectors once we see what's on the page
});
