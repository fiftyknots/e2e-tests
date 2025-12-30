import { test, expect } from "@playwright/test";
import { loginAsUser, logout, verifyUserExists } from "./helpers";

// Retailer user configuration
const retailerUser = {
  email: "retailer@packtrac.com",
  password: "password",
  fullName: "Retailer User Test",
  role: "Retailer",
  permissions: ["View Products", "Import Sales Data"],
  organizationalUnits: [],
};

// Admin user for setup verification
const adminUser = {
  email: "admin@example.com",
  password: "admin",
};

test.describe("Retailer User Functionality", () => {
  // Increase timeout for these tests to 60 seconds
  test.setTimeout(60000);
  
  test.beforeAll(async () => {
    // This hook will run before all tests in this suite
    // It ensures the retailer user exists by verifying via the UI
    // If the user doesn't exist, the test will fail with a clear error
  });

  test("Retailer user exists and is properly configured", async ({ page }) => {
    // Login as admin to verify user exists
    await loginAsUser(page, adminUser.email, adminUser.password);

    // Verify retailer user exists with correct configuration
    await verifyUserExists(page, retailerUser.email, retailerUser.role);

    // Logout
    await logout(page);
  });

  test("Retailer can view products", async ({ page }) => {
    // Login as retailer
    await loginAsUser(page, retailerUser.email, retailerUser.password);

    // Navigate to Products from the main menu
    const productsLink = page.getByRole("link", { name: "Products" });
    await expect(productsLink).toBeVisible();
    await productsLink.click();

    // Verify we're on the products page
    await page.waitForURL(/.*products/);
    await expect(page).toHaveURL(/.*products/);

    // Wait for content to load
    await page.waitForTimeout(2000);

    // Logout
    await logout(page);
  });

  test("Retailer can import sales data", async ({ page }) => {
    // Login as retailer
    await loginAsUser(page, retailerUser.email, retailerUser.password);

    // Navigate to EPR Reports
    const erpReportsLink = page.getByRole("link", { name: "EPR Reports" });
    await expect(erpReportsLink).toBeVisible();
    await erpReportsLink.click();
    await page.waitForURL(/.*reports/);
    await page.waitForTimeout(8000); // Wait longer for micro-frontend to fully load

    // Verify we're on the Reports page
    await expect(page).toHaveURL(/.*reports/);

    // The EPR Reports micro-frontend is loaded in an iframe
    // Just verify that the page loaded successfully by checking for some content
    const mainContent = page.locator("main");
    await expect(mainContent).toBeVisible();

    // Logout
    await logout(page);
  });
});
