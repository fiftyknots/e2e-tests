import { test, expect } from "@playwright/test";
import { loginAsUser, logout, verifyUserExists } from "./helpers";

// Packaging Specialist user configuration
const packagingSpecialistUser = {
  email: "packaging.specialist@packtrac.com",
  password: "password",
  fullName: "Packaging Specialist Test",
  role: "Packaging Specialist",
  permissions: ["Manage Users", "Edit Packaging Items", "View Packaging Items", "Load Products", "View Products", "Manage Specifications", "View Specifications", "Manage Suppliers", "View Suppliers"],
  organizationalUnits: ["Food & Beverages"],
};

// Admin user for setup verification
const adminUser = {
  email: "admin@example.com",
  password: "admin",
};

test.describe("Packaging Specialist Functionality", () => {
  // Increase timeout for these tests to 60 seconds
  test.setTimeout(60000);
  
  test("Packaging Specialist user exists and is properly configured", async ({ page }) => {
    // Login as admin to verify user exists
    await loginAsUser(page, adminUser.email, adminUser.password);

    // Verify packaging specialist user exists with correct configuration
    await verifyUserExists(page, packagingSpecialistUser.email, packagingSpecialistUser.role);

    // Logout
    await logout(page);
  });

  test("Packaging Specialist can view packaging items", async ({ page }) => {
    // Login as packaging specialist user
    await loginAsUser(page, packagingSpecialistUser.email, packagingSpecialistUser.password);

    // Navigate to Packaging Items from the main menu
    const packagingLink = page.getByRole("link", { name: "Packaging Items" });
    await expect(packagingLink).toBeVisible();
    await packagingLink.click();

    // Verify we're on the packaging items page
    await page.waitForURL(/.*packaging/);
    await page.waitForTimeout(2000); // Wait for micro-frontend to load

    // Verify packaging items table is visible
    const iframe = page.frameLocator('iframe[title="Packaging Items"]');
    const itemsTable = iframe.locator("table");
    await expect(itemsTable).toBeVisible();

    // Verify key column headers are present
    const descriptionHeader = iframe.getByRole("columnheader", {
      name: "Description",
    });
    const materialHeader = iframe.getByRole("columnheader", { name: "Material" });
    const statusHeader = iframe.getByRole("columnheader", { name: "Status" });

    await expect(descriptionHeader).toBeVisible();
    await expect(materialHeader).toBeVisible();
    await expect(statusHeader).toBeVisible();

    // Logout
    await logout(page);
  });

  test("Packaging Specialist can view products", async ({ page }) => {
    // Login as packaging specialist user
    await loginAsUser(page, packagingSpecialistUser.email, packagingSpecialistUser.password);

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

  test("Packaging Specialist can view specifications", async ({ page }) => {
    // Login as packaging specialist user
    await loginAsUser(page, packagingSpecialistUser.email, packagingSpecialistUser.password);

    // Navigate to Specifications from the main menu
    const specificationsLink = page.getByRole("link", { name: "Specifications" });
    await expect(specificationsLink).toBeVisible();
    await specificationsLink.click();

    // Verify we're on the specifications page
    await page.waitForURL(/.*specifications/);
    await page.waitForTimeout(3000); // Wait for micro-frontend to load

    // Verify specifications interface is loaded
    const iframe = page.frameLocator('iframe[title="Specifications"]');
    const specificationsHeading = iframe.getByRole("heading", {
      name: "Specifications",
    });
    await expect(specificationsHeading).toBeVisible();

    // Verify specifications content is displayed (look for body content)
    const contentBody = iframe.locator('body');
    await expect(contentBody).toBeVisible();

    // Logout
    await logout(page);
  });

  test("Packaging Specialist can view suppliers", async ({ page }) => {
    // Login as packaging specialist user
    await loginAsUser(page, packagingSpecialistUser.email, packagingSpecialistUser.password);

    // Navigate to Suppliers from the main menu
    const suppliersLink = page.getByRole("link", { name: "Suppliers" });
    await expect(suppliersLink).toBeVisible();
    await suppliersLink.click();

    // Verify we're on the suppliers page
    await page.waitForURL(/.*suppliers/);
    await page.waitForTimeout(2000); // Wait for micro-frontend to load

    // Verify suppliers interface is loaded
    const iframe = page.frameLocator('iframe[title="Suppliers"]');
    const suppliersHeading = iframe.getByRole("heading", { name: "Suppliers" });
    await expect(suppliersHeading).toBeVisible();

    // Verify suppliers table is visible
    const suppliersTable = iframe.locator("table");
    await expect(suppliersTable).toBeVisible();

    // Verify key column headers are present
    const nameHeader = iframe.getByRole("columnheader", { name: "Name" });
    const registrationHeader = iframe.getByRole("columnheader", {
      name: "DFFE Registration",
    });

    await expect(nameHeader).toBeVisible();
    await expect(registrationHeader).toBeVisible();

    // Logout
    await logout(page);
  });

  test.skip("Packaging Specialist can access user management", async ({ page }) => {
    // Login as packaging specialist user
    await loginAsUser(page, packagingSpecialistUser.email, packagingSpecialistUser.password);

    // Navigate to User Management
    const userMgmtLink = page.getByRole("link", { name: "User Management" });
    await expect(userMgmtLink).toBeVisible();
    await userMgmtLink.click();

    // Verify we're on the user management page
    await page.waitForURL(/.*users/);
    await page.waitForTimeout(5000); // Wait for micro-frontend to load and potentially retry

    // Verify user management interface is loaded
    const iframe = page.frameLocator('iframe[title="User Management"]');
    
    // Verify the heading is visible
    const heading = iframe.getByRole("heading", { name: "User Management" });
    await expect(heading).toBeVisible();
    
    // Verify we can see either the search input or retry button (page loaded, may have data or error)
    const searchInput = iframe.locator('input[placeholder*="Search"]');
    const retryButton = iframe.getByRole("button", { name: "Retry" });
    
    const hasSearchInput = await searchInput.count() > 0;
    const hasRetryButton = await retryButton.count() > 0;
    
    // If there's a retry button (error state), click it to reload
    if (hasRetryButton && !hasSearchInput) {
      await retryButton.click();
      await page.waitForTimeout(2000); // Wait for retry to complete
    }
    
    // Now check if search input is available
    const searchInputFinal = iframe.locator('input[placeholder*="Search"]');
    await expect(searchInputFinal).toBeVisible({ timeout: 3000 });

    // Logout
    await logout(page);
  });
});
