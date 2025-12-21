import { test, expect } from "@playwright/test";

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

// Helper function to log in
async function loginAsUser(page, email: string, password: string) {
  await page.goto("/");
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL(/.*dashboard/);
}

// Helper function to log out
async function logout(page) {
  // Wait for any loading overlays to disappear
  await page.waitForTimeout(1000);
  
  const userButton = page
    .getByRole("button", {
      name: /Admin User|Packaging Technologist/,
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

// Helper function to verify user exists
async function verifyUserExists(page, userEmail: string, userRole: string) {
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
    await expect(page).toHaveURL(/.*packaging/);

    // Wait for content to load
    await page.waitForTimeout(2000);

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
    await expect(page).toHaveURL(/.*products/);

    // Wait for content to load
    await page.waitForTimeout(2000);

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
    await expect(page).toHaveURL(/.*specifications/);

    // Wait for content to load
    await page.waitForTimeout(2000);

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
    await expect(page).toHaveURL(/.*suppliers/);

    // Wait for content to load
    await page.waitForTimeout(2000);

    // Logout
    await logout(page);
  });
});
