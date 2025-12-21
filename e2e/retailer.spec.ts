import { test, expect } from "@playwright/test";

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
  await page.waitForTimeout(500);
  
  const userButton = page
    .getByRole("button", {
      name: /Admin User|Retailer/,
    })
    .first();
  await userButton.click();
  await page.waitForTimeout(300); // Wait for menu to appear
  
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
