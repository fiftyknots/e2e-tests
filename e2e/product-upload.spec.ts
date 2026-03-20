import { test, expect } from "@playwright/test";
import { loginAsUser, logout } from "./helpers";
import { testCredentials } from "./config";
import path from "path";

const uploadUser = {
  email: testCredentials.admin.email,
  password: testCredentials.admin.password,
};

// Relative to this file: ../../products/data/sample.csv
const SAMPLE_CSV = path.resolve(__dirname, "../../products/data/sample.csv");

test.describe("Product Upload", () => {
  // Large file: staging insert + fn_compare_product_data can take up to 90s
  test.setTimeout(180000);

  test("can upload a CSV and see comparison results without error", async ({ page }) => {
    await loginAsUser(page, uploadUser.email, uploadUser.password);

    // Navigate to the Products section
    await page.getByRole("link", { name: "Products" }).click();
    await page.waitForURL(/.*products/);

    const iframe = page.frameLocator('iframe[title="Products"]');

    // Wait for the Products micro-frontend to bootstrap, then click the upload button.
    // The button is only visible when the user has load_products permission and is not already on /upload.
    const uploadArticleReportButton = iframe.getByRole("button", { name: "Upload Article Report" });
    await expect(uploadArticleReportButton).toBeVisible({ timeout: 30000 });
    await uploadArticleReportButton.click();

    // Verify the upload card rendered inside the iframe (router navigated to /upload)
    await expect(iframe.getByRole("heading", { name: "Upload Article Report" })).toBeVisible({ timeout: 10000 });

    // Trigger the hidden file input directly (Playwright can set files on hidden inputs)
    const fileInput = iframe.locator('input[type="file"][accept=".csv"]');
    await fileInput.setInputFiles(SAMPLE_CSV);

    // Column mapping modal should appear — sample.csv headers match all auto-detect patterns
    await expect(iframe.getByRole("heading", { name: "Map CSV Columns" })).toBeVisible({ timeout: 10000 });

    // All fields should be auto-detected, so Apply Mapping should be enabled immediately
    const applyButton = iframe.getByRole("button", { name: "Apply Mapping" });
    await expect(applyButton).toBeEnabled();

    // Watch the network: fn_compare_product_data must return 200 (not 500 timeout)
    const compareResponsePromise = page.waitForResponse(
      (resp) => resp.url().includes("fn_compare_product_data"),
      { timeout: 90000 }
    );

    await applyButton.click();

    const compareResponse = await compareResponsePromise;
    if (compareResponse.status() !== 200) {
      const body = await compareResponse.text().catch(() => "(could not read body)");
      console.error("fn_compare_product_data 500 body:", body);
    }
    expect(compareResponse.status()).toBe(200);

    // After a successful comparison the Upload CSV button re-enables
    await expect(iframe.getByRole("button", { name: "Upload CSV" })).toBeEnabled({
      timeout: 10000,
    });

    // If there are any product changes returned, the "Product Changes" section should render
    // (it's absent when all rows are "no_change", so we don't assert it unconditionally)

    await logout(page);
  });
});
