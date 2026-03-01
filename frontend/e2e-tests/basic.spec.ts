import { test, expect } from '@playwright/test';

test('homepage has expected elements', async ({ page }) => {
    // 1. Increase timeout and wait for 'commit' for hydration stability
    await page.goto('/', {
        timeout: 60000,
        waitUntil: 'commit'
    });

    // 2. Updated Regex to match actual title: "THE BUREAU | Introducing AVA"
    await expect(page).toHaveTitle(/THE BUREAU | Introducing AVA/);

    // 3. Verify core structural elements from the AEO/SEO layer are visible
    await expect(page.getByRole('heading', { name: 'What is AVA (Autonomous Validation Analyst)?' })).toBeVisible();
});
