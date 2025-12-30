import { test, expect } from "@playwright/test";
import { loginAsUser, logout, verifyUserExists } from "./helpers";

// Packaging Technologist user configuration
const packagingTechUser = {
  email: "packaging.tech@packtrac.com",
  password: "password",
  fullName: "Packaging Technologist Test",
  role: "Packaging Technologist",
  permissions: ["Edit Packaging Items", "View Packaging Items", "Load Products", "View Products", "View Specifications", "View Suppliers"],
  organizationalUnits: [],
};

// Admin user for setup verification
const adminUser = {
  email: "admin@example.com",
  password: "admin",
};

test.describe("Packaging Technologist Functionality", () => {
  // Increase timeout for these tests to 60 seconds
  test.setTimeout(60000);
  
  test("Packaging Technologist user exists and is properly configured", async ({ page }) => {
    // Login as admin to verify user exists
    await loginAsUser(page, adminUser.email, adminUser.password);

    // Verify packaging technologist user exists with correct configuration
    await verifyUserExists(page, packagingTechUser.email, packagingTechUser.role);

    // Logout
    await logout(page);
  });

  test("Packaging Technologist can view packaging items", async ({ page }) => {
    // Login as packaging technologist user
    await loginAsUser(page, packagingTechUser.email, packagingTechUser.password);

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

  test("Packaging Technologist can view products", async ({ page }) => {
    // Login as packaging technologist user
    await loginAsUser(page, packagingTechUser.email, packagingTechUser.password);

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

  test("Packaging Technologist can view specifications", async ({ page }) => {
    // Login as packaging technologist user
    await loginAsUser(page, packagingTechUser.email, packagingTechUser.password);

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

  test("Packaging Technologist can view suppliers", async ({ page }) => {
    // Login as packaging technologist user
    await loginAsUser(page, packagingTechUser.email, packagingTechUser.password);

    // Navigate to Packaging Suppliers from the main menu
    const suppliersLink = page.getByRole("link", { name: "Packaging Suppliers" });
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
});
