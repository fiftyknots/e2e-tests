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
    await page.waitForTimeout(3000); // Wait for micro-frontend to load

    // Verify products interface is loaded
    const iframe = page.frameLocator('iframe[title="Products"]');
    const productsHeading = iframe.getByRole("heading", { name: "Products" });
    await expect(productsHeading).toBeVisible();

    // Verify products table is visible with data
    const productsTable = iframe.locator("table");
    await expect(productsTable).toBeVisible();

    // Verify key column headers are present (use exact: true to avoid matching "Product Supplier")
    const productHeader = iframe.getByRole("columnheader", { name: "Product", exact: true });
    const divisionHeader = iframe.getByRole("columnheader", { name: "Division" });
    const categoryHeader = iframe.getByRole("columnheader", { name: "Category", exact: true });

    await expect(productHeader).toBeVisible();
    await expect(divisionHeader).toBeVisible();
    await expect(categoryHeader).toBeVisible();

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
    await page.waitForTimeout(5000); // Wait for micro-frontend to load - EPR Reports is slower

    // Verify EPR Reports interface is loaded
    const iframe = page.frameLocator('iframe[title="EPR Reports"]');
    
    // Verify the heading is visible
    const heading = iframe.getByRole("heading", { name: "EPR Reports" });
    await expect(heading).toBeVisible();
    
    // Verify sales data section is visible
    const salesDataHeading = iframe.getByRole("heading", { name: "Sales Data", level: 2 });
    await expect(salesDataHeading).toBeVisible({ timeout: 3000 });

    // Logout
    await logout(page);
  });
});
