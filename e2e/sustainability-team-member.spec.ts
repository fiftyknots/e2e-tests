import { test, expect } from "@playwright/test";
import { loginAsUser, logout, verifyUserExists } from "./helpers";

// Sustainability Team Member user configuration
const sustainabilityUser = {
  email: "sustainability@packtrac.com",
  password: "password",
  fullName: "Sustainability Team Member Test",
  role: "Sustainability Team Member",
  permissions: ["View Packaging Items", "View Specifications", "Manage Specifications"],
  organizationalUnits: [],
};

// Admin user for setup verification
const adminUser = {
  email: "admin@example.com",
  password: "admin",
};

test.describe("Sustainability Team Member Functionality", () => {
  // Increase timeout for these tests to 60 seconds
  test.setTimeout(60000);
  
  test("Sustainability user exists and is properly configured", async ({ page }) => {
    // Login as admin to verify user exists
    await loginAsUser(page, adminUser.email, adminUser.password);

    // Verify sustainability user exists with correct configuration
    await verifyUserExists(page, sustainabilityUser.email, sustainabilityUser.role);

    // Logout
    await logout(page);
  });

  test("Sustainability user can view packaging items", async ({ page }) => {
    // Login as sustainability user
    await loginAsUser(page, sustainabilityUser.email, sustainabilityUser.password);

    // Navigate to Packaging Items from the main menu
    const packagingLink = page.getByRole("link", { name: "Packaging Items" });
    await expect(packagingLink).toBeVisible();
    await packagingLink.click();

    // Verify we're on the packaging items page
    await page.waitForURL(/.*packaging/);
    await expect(page).toHaveURL(/.*packaging/);

    // Wait for content to load
    await page.waitForTimeout(2000);

    // Logout
    await logout(page);
  });

  test("Sustainability user can view specifications", async ({ page }) => {
    // Login as sustainability user
    await loginAsUser(page, sustainabilityUser.email, sustainabilityUser.password);

    // Navigate to Specifications from the main menu
    const specificationsLink = page.getByRole("link", { name: "Specifications" });
    await expect(specificationsLink).toBeVisible();
    await specificationsLink.click();

    // Verify we're on the specifications page
    await page.waitForURL(/.*specifications/);
    await expect(page).toHaveURL(/.*specifications/);

    // Wait for content to load
    await page.waitForTimeout(2000);

    // Logout
    await logout(page);
  });
});
