import { expect, Page } from "@playwright/test";

/**
 * Helper function to log in with provided credentials
 */
export async function loginAsUser(page: Page, email: string, password: string) {
  await page.goto("/");
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL(/.*dashboard/);
}

/**
 * Helper function to log out
 */
export async function logout(page: Page) {
  // Wait for any loading overlays to disappear
  await page.waitForTimeout(1000);

  const userButton = page
    .getByRole("button", {
      name: /Admin User|Packaging Technologist|Packaging Specialist|QA Technologist|Retailer|Sustainability/,
    })
    .first();
  await userButton.click();
  await page.waitForTimeout(500); // Wait for menu to appear

  const logoutButton = page.getByRole("button", { name: "Logout" });
  // Wait for logout button to be clickable (not blocked by overlays)
  await logoutButton.waitFor({ state: "visible", timeout: 5000 });
  await logoutButton.click();
  await page.waitForURL(/.*login/);
}

/**
 * Helper function to verify user exists and has correct role
 */
export async function verifyUserExists(page: Page, userEmail: string, userRole: string) {
  // Navigate to user management
  await page.getByRole("link", { name: "User Management" }).click();
  await page.waitForURL(/.*\/users/);
  await page.waitForTimeout(3000); // Wait for micro-frontend to load

  // Get iframe and search for user
  const iframe = page.frameLocator('iframe[title="User Management"]');
  const searchInput = iframe.locator('input[placeholder="Search users..."]');

  // Wait for the search input to be available before filling
  await searchInput.waitFor({ state: "visible", timeout: 10000 });
  await searchInput.fill(userEmail);
  await page.waitForTimeout(1500);

  // Verify user exists in table
  const userEmailCell = iframe.locator("text=" + userEmail);
  await expect(userEmailCell).toBeVisible();

  // Verify user has correct role in the same row
  const userRow = iframe
    .locator("table tbody tr")
    .filter({ has: iframe.locator(`text=${userEmail}`) });
  // Use getByRole to get exact cell match
  const roleCell = userRow.getByRole("cell", { name: userRole, exact: true });
  await expect(roleCell).toBeVisible();
}
