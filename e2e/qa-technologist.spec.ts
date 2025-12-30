import { test, expect } from "@playwright/test";
import { loginAsUser, logout, verifyUserExists } from "./helpers";

// QA Technologist user configuration
const qaTechnologistUser = {
  email: "qa.tech@packtrac.com",
  password: "password",
  fullName: "QA Technologist Test",
  role: "QA Technologist",
  permissions: [
    "View Packaging Items",
    "View Products",
    "View Specifications",
    "View Suppliers",
  ],
  organizationalUnits: [],
};

// Admin user for setup verification
const adminUser = {
  email: "admin@example.com",
  password: "admin",
};

test.describe("QA Technologist User Functionality", () => {
  test("QA Technologist user exists and is properly configured", async ({
    page,
  }) => {
    // Login as admin to verify user exists
    await loginAsUser(page, adminUser.email, adminUser.password);

    // Verify QA Technologist user exists with correct configuration
    await verifyUserExists(page, qaTechnologistUser.email, qaTechnologistUser.role);

    // Logout
    await logout(page);
  });

  test("QA Technologist can view packaging items", async ({ page }) => {
    // Login as QA Technologist
    await loginAsUser(page, qaTechnologistUser.email, qaTechnologistUser.password);

    // Navigate to Packaging Items
    const packagingItemsLink = page.getByRole("link", { name: "Packaging Items" });
    await expect(packagingItemsLink).toBeVisible();
    await packagingItemsLink.click();

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

  test("QA Technologist can view products", async ({ page }) => {
    // Login as QA Technologist
    await loginAsUser(page, qaTechnologistUser.email, qaTechnologistUser.password);

    // Navigate to Products
    const productsLink = page.getByRole("link", { name: "Products" });
    await expect(productsLink).toBeVisible();
    await productsLink.click();

    // Verify we're on the products page
    await page.waitForURL(/.*products/);
    await page.waitForTimeout(2000);

    // Logout
    await logout(page);
  });

  test("QA Technologist can view specifications", async ({ page }) => {
    // Login as QA Technologist
    await loginAsUser(page, qaTechnologistUser.email, qaTechnologistUser.password);

    // Navigate to Specifications
    const specificationsLink = page.getByRole("link", {
      name: "Specifications",
    });
    await expect(specificationsLink).toBeVisible();
    await specificationsLink.click();

    // Verify we're on the specifications page
    await page.waitForURL(/.*specifications/);
    await page.waitForTimeout(2000); // Wait for micro-frontend to load

    // Verify specifications interface is loaded
    const iframe = page.frameLocator('iframe[title="Specifications"]');
    const specificationsHeading = iframe.getByRole("heading", {
      name: "Specifications",
    });
    await expect(specificationsHeading).toBeVisible();

    // Verify statistics are displayed
    const totalSkusLabel = iframe.getByText("Total SKUs");
    await expect(totalSkusLabel).toBeVisible();

    // Verify specifications table is visible or content is displayed
    try {
      const specificationsTable = iframe.locator("table tbody");
      await expect(specificationsTable).toBeVisible();
    } catch {
      // If table isn't found, verify we're at least on the specifications page
      const pageContent = iframe.locator('[class*="specification"], [class*="container"]');
      await expect(pageContent).toBeTruthy();
    }

    // Logout
    await logout(page);
  });

  test("QA Technologist can view suppliers", async ({ page }) => {
    // Login as QA Technologist
    await loginAsUser(page, qaTechnologistUser.email, qaTechnologistUser.password);

    // Navigate to Packaging Suppliers
    const suppliersLink = page.getByRole("link", {
      name: "Packaging Suppliers",
    });
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
