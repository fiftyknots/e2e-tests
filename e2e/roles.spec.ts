import { test, expect } from "@playwright/test";

// Test configuration for each role
const testUsers = {
  admin: {
    email: "admin@example.com",
    password: "admin",
    fullName: "Admin User",
    role: "Administrator",
    permissions: [
      "Manage Users",
      "Manage Organizational Hierarchy",
      "Edit Packaging Items",
      "View Packaging Items",
      "Load Products",
      "View Products",
      "Manage Specifications",
      "View Specifications",
      "Manage Suppliers",
      "View Suppliers",
      "Import Sales Data",
      "Export Reports",
      "View Sales Data",
    ],
    organizationalUnits: [],
  },
  sustainabilityTeamMember: {
    email: "sustainability.member@packtrac.com",
    password: "password",
    fullName: "Sustainability Team Member Test",
    role: "Sustainability Team Member",
    permissions: [
      "View Packaging Items",
      "View Products",
      "View Specifications",
      "View Suppliers",
      "Export Reports",
    ],
    organizationalUnits: [],
  },
  packagingTechnologist: {
    email: "packaging.tech@packtrac.com",
    password: "password",
    fullName: "Packaging Technologist Test",
    role: "Packaging Technologist",
    permissions: [
      "Edit Packaging Items",
      "View Packaging Items",
      "Load Products",
      "View Products",
      "View Specifications",
      "View Suppliers",
    ],
    organizationalUnits: [],
    shouldHaveFirstOrgUnit: true,
  },
  qaTechnologist: {
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
    shouldHaveFirstOrgUnit: true,
  },
  packagingSpecialist: {
    email: "packaging.specialist@packtrac.com",
    password: "password",
    fullName: "Packaging Specialist Test",
    role: "Packaging Specialist",
    permissions: [
      "Manage Users",
      "Edit Packaging Items",
      "View Packaging Items",
      "Load Products",
      "View Products",
      "Manage Specifications",
      "View Specifications",
      "Manage Suppliers",
      "View Suppliers",
    ],
    organizationalUnits: [],
    shouldHaveFirstOrgUnit: true,
  },
  retailer: {
    email: "retailer@packtrac.com",
    password: "password",
    fullName: "Retailer User Test",
    role: "Retailer",
    permissions: ["View Products", "Import Sales Data"],
    organizationalUnits: [],
  },
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
  const userButton = page
    .getByRole("button", {
      name: /Admin User|Sustainability Team Member|Packaging Technologist|QA Technologist|Packaging Specialist|Retailer/,
    })
    .first();
  await userButton.click();
  const logoutButton = page.getByRole("button", { name: "Logout" });
  await logoutButton.click();
  await page.waitForURL(/.*login/);
}

// Helper function to verify user exists and has correct role
async function verifyUserExists(
  page,
  userEmail: string,
  userRole: string,
  shouldHaveFirstOrgUnit: boolean = false
) {
  // Navigate to user management
  await page.getByRole("link", { name: "User Management" }).click();
  await page.waitForURL(/.*\/users/);
  await page.waitForTimeout(2000); // Wait for micro-frontend to load

  // Get iframe and search for user
  const iframe = page.frameLocator('iframe[title="User Management"]');
  const searchInput = iframe.locator('input[placeholder="Search users..."]');
  await searchInput.fill(userEmail);
  await page.waitForTimeout(1500);

  // Verify user exists in table
  const userEmailCell = iframe.locator("text=" + userEmail);
  await expect(userEmailCell).toBeVisible();

  // Verify user has correct role in the same row
  const userRow = iframe
    .locator("table tbody tr")
    .filter({ has: iframe.locator(`text=${userEmail}`) });
  await expect(userRow.locator(`text=${userRole}`)).toBeVisible();

  // Click Edit button to verify organizational unit settings
  const editButton = userRow.locator("button", { hasText: /Edit|edit/ });
  await editButton.click();
  await page.waitForTimeout(1500); // Wait for modal to open

  // Verify organizational unit checkbox settings
  if (shouldHaveFirstOrgUnit) {
    // Get the first org unit checkbox and verify it's checked
    const firstOrgUnitCheckbox = iframe
      .locator('input[type="checkbox"]')
      .first();
    await expect(firstOrgUnitCheckbox).toBeChecked();

    // Verify nested checkboxes under the first org unit are also checked
    const orgUnitContainer = iframe.locator('[role="region"]').first();
    const nestedCheckboxes = orgUnitContainer.locator(
      'input[type="checkbox"]:checked'
    );
    const checkedCount = await nestedCheckboxes.count();
    expect(checkedCount).toBeGreaterThan(0);
  }

  // Close the modal by pressing Escape
  await page.press("body", "Escape");
  await page.waitForTimeout(500);
}

test.describe("User Role Tests", () => {
  test("Administrator role exists and can login", async ({ page }) => {
    const user = testUsers.admin;

    // Login as admin to verify user
    await loginAsUser(page, testUsers.admin.email, testUsers.admin.password);

    // Verify user exists with correct configuration
    await verifyUserExists(page, user.email, user.role);

    // Logout
    await logout(page);

    // Login as the user to confirm they can access the system
    await loginAsUser(page, user.email, user.password);
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test("Sustainability Team Member role exists and can login", async ({
    page,
  }) => {
    const user = testUsers.sustainabilityTeamMember;

    // Login as admin to verify user
    await loginAsUser(page, testUsers.admin.email, testUsers.admin.password);

    // Verify user exists with correct configuration
    await verifyUserExists(page, user.email, user.role, user.shouldHaveFirstOrgUnit || false);

    // Logout
    await logout(page);

    // Login as the user to confirm they can access the system
    await loginAsUser(page, user.email, user.password);
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test("Packaging Technologist role exists and can login", async ({ page }) => {
    const user = testUsers.packagingTechnologist;

    // Login as admin to verify user
    await loginAsUser(page, testUsers.admin.email, testUsers.admin.password);

    // Verify user exists with correct configuration
    await verifyUserExists(page, user.email, user.role, user.shouldHaveFirstOrgUnit || false);

    // Logout
    await logout(page);

    // Login as the user to confirm they can access the system
    await loginAsUser(page, user.email, user.password);
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test("QA Technologist role exists and can login", async ({ page }) => {
    const user = testUsers.qaTechnologist;

    // Login as admin to verify user
    await loginAsUser(page, testUsers.admin.email, testUsers.admin.password);

    // Verify user exists with correct configuration
    await verifyUserExists(page, user.email, user.role, user.shouldHaveFirstOrgUnit || false);

    // Logout
    await logout(page);

    // Login as the user to confirm they can access the system
    await loginAsUser(page, user.email, user.password);
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test("Packaging Specialist role exists and can login", async ({ page }) => {
    const user = testUsers.packagingSpecialist;

    // Login as admin to verify user
    await loginAsUser(page, testUsers.admin.email, testUsers.admin.password);

    // Verify user exists with correct configuration
    await verifyUserExists(page, user.email, user.role, user.shouldHaveFirstOrgUnit || false);

    // Logout
    await logout(page);

    // Login as the user to confirm they can access the system
    await loginAsUser(page, user.email, user.password);
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test("Retailer role exists and can login", async ({ page }) => {
    const user = testUsers.retailer;

    // Login as admin to verify user
    await loginAsUser(page, testUsers.admin.email, testUsers.admin.password);

    // Verify user exists with correct configuration
    await verifyUserExists(page, user.email, user.role, user.shouldHaveFirstOrgUnit || false);

    // Logout
    await logout(page);

    // Login as the user to confirm they can access the system
    await loginAsUser(page, user.email, user.password);
    await expect(page).toHaveURL(/.*dashboard/);
  });
});
