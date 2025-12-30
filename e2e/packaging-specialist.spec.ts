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
    await expect(page).toHaveURL(/.*packaging/);

    // Wait for content to load
    await page.waitForTimeout(2000);

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
    await expect(page).toHaveURL(/.*products/);

    // Wait for content to load
    await page.waitForTimeout(2000);

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
    await expect(page).toHaveURL(/.*specifications/);

    // Wait for content to load
    await page.waitForTimeout(2000);

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
    await expect(page).toHaveURL(/.*suppliers/);

    // Wait for content to load
    await page.waitForTimeout(2000);

    // Logout
    await logout(page);
  });

  test("Packaging Specialist can access user management", async ({ page }) => {
    // Login as packaging specialist user
    await loginAsUser(page, packagingSpecialistUser.email, packagingSpecialistUser.password);

    // Navigate to User Management
    const userMgmtLink = page.getByRole("link", { name: "User Management" });
    await expect(userMgmtLink).toBeVisible();
    await userMgmtLink.click();

    // Verify we're on the user management page
    await page.waitForURL(/.*users/);
    await expect(page).toHaveURL(/.*users/);

    // Wait for micro-frontend to load
    await page.waitForTimeout(3000);

    // Logout
    await logout(page);
  });
});
