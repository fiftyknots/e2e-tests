import { test, expect } from '@playwright/test';

test('login to packtrac', async ({ page }) => {
  const username = process.env.LOGIN_USERNAME || 'admin@example.com';
  const password = process.env.LOGIN_PASSWORD || 'admin';

  // Navigate to the login page
  await page.goto('/');

  // Fill in the login form
  await page.fill('input[type="email"]', username);
  await page.fill('input[type="password"]', password);

  // Submit the form
  await page.click('button[type="submit"]');

  // Wait for navigation and verify successful login
  await page.waitForURL(/dashboard/);
  await expect(page).toHaveURL(/dashboard/);
});
