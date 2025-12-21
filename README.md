# E2E Test Suite - PackTrac Application

Comprehensive end-to-end test coverage for the PackTrac Packaging Specifications Management System, with automated test user creation and role-based access verification.

## Overview

This test suite validates:
- User authentication and login functionality
- Role-based access control for six user roles
- Feature access permissions for each role
- Organizational unit assignments and restrictions
- Micro-frontend iframe interactions (User Management, EPR Reports)

## Testing Framework & Methodology

### Technology Stack
- **Framework:** Playwright Test (TypeScript)
- **Target Environment:** https://demo.packtrac.com (demo environment)
- **Test Execution:** Parallel (4 workers by default)
- **Test Timeout:** 60 seconds per test (increased from 30s to accommodate iframe loading)

### Test Structure & Patterns

All test specs follow a consistent pattern:

1. **User Configuration Object** - Defines role, email, password, permissions, and organizational units
2. **Helper Functions** - Reusable authentication and verification utilities
3. **Test Assertions** - Verify user access to role-specific features
4. **Cleanup** - Logout after each test to reset session state

#### Shared Helper Functions

All specs include these helper functions for consistency:

```typescript
loginAsUser(page, email: string, password: string)
// - Navigate to login page
// - Fill email and password fields
// - Wait for dashboard page load

logout(page)
// - Wait for loading overlays to disappear
// - Click user menu button
// - Wait for logout button visibility
// - Click logout and verify login page appears

verifyUserExists(page, userEmail: string, userRole: string)
// - Navigate to User Management
// - Wait 3 seconds for iframe to load
// - Search for user by email in iframe
// - Verify role matches in table
```

### Key Technical Solutions

**Iframe Interaction Pattern**
- User Management and EPR Reports are micro-frontends loaded in iframes
- Use `page.frameLocator('iframe[title="..."]').contentFrame()` to access iframe content
- Always wait for iframe load before interacting: `await page.waitForTimeout(3000)`
- Use `.waitFor()` on input elements before filling to ensure iframe is ready

**Handling Loading Overlays**
- Some pages show loading overlays that can block clicks
- Solution: Add `await page.waitForTimeout(1000)` before clicking buttons
- Use `logoutButton.waitFor({ state: "visible", timeout: 5000 })` to ensure button is unblocked

**Test Timeout Strategy**
- Tests increased from 30 seconds to 60 seconds due to iframe load times
- Applied via `test.setTimeout(60000)` at test.describe level
- Micro-frontends typically require 6-8 seconds to load fully

## Test Specs

### 1. retailer.spec.ts
**Purpose:** Verify Retailer user can access assigned features

**User Configuration:**
- Email: `retailer@packtrac.com`
- Password: `password`
- Role: Retailer
- Permissions: 2 (View Products, Import Sales Data)
- Organizational Units: None

**Tests:** 3 passing
- User exists and is properly configured
- Can view products
- Can access EPR Reports (import sales data)

### 2. sustainability-team-member.spec.ts
**Purpose:** Verify Sustainability Team Member user can access packaging and specification features

**User Configuration:**
- Email: `sustainability@packtrac.com`
- Password: `password`
- Role: Sustainability Team Member
- Permissions: 5 (View Packaging Items, View Products, View Specifications, View Suppliers, Export Reports)
- Organizational Units: None

**Tests:** 3 passing
- User exists and is properly configured
- Can view packaging items
- Can view specifications

### 3. packaging-technologist.spec.ts
**Purpose:** Verify Packaging Technologist user can access multiple packaging, product, and supplier features

**User Configuration:**
- Email: `packaging.tech@packtrac.com`
- Password: `password`
- Role: Packaging Technologist
- Permissions: 6 (Edit Packaging Items, View Packaging Items, Load Products, View Products, View Specifications, View Suppliers)
- Organizational Units: Food & Beverages (first available)

**Tests:** 5 passing
- User exists and is properly configured
- Can view packaging items
- Can view products
- Can view specifications
- Can view suppliers

### 4. packaging-specialist.spec.ts
**Purpose:** Verify Packaging Specialist user can access comprehensive management and view features

**User Configuration:**
- Email: `packaging.specialist@packtrac.com`
- Password: `password`
- Role: Packaging Specialist
- Permissions: 9 (Manage Users, Edit Packaging Items, View Packaging Items, Load Products, View Products, Manage Specifications, View Specifications, Manage Suppliers, View Suppliers)
- Organizational Units: Food & Beverages (first available)

**Tests:** 6 passing
- User exists and is properly configured
- Can view packaging items
- Can view products
- Can view specifications
- Can view suppliers
- Can access user management (unique permission)

## Test Generation Methodology

The test development process follows a systematic pattern:

### 1. User Creation (via Playwright Browser)
- Navigate to application as admin
- Access User Management micro-frontend
- Click "Add User" button
- Fill form with user details:
  - Email
  - Password
  - Full Name
  - Select Role (permissions auto-populate)
  - Select Organizational Unit (only first available, as specified)
- Click "Create User" and verify success toast

### 2. Spec File Creation
- Copy template from existing spec (or create new from scratch)
- Update user configuration object with new credentials and permissions
- Create test for "user exists and is properly configured" (same for all roles)
- Create feature access tests based on user permissions:
  - Each permission maps to a navigation test
  - Navigate to feature → verify URL matches → wait for content load
  - Test patterns are consistent across all specs

### 3. Test Iteration
- Run new spec: `npm test e2e/new-spec.spec.ts`
- Debug failures:
  - Timeout issues → increase wait times or add `.waitFor()` calls
  - Iframe loading → add `await page.waitForTimeout(3000)` before iframe interaction
  - Overlay blocking clicks → add initial `await page.waitForTimeout(1000)`
  - Missing elements → verify URL, element visibility, or selector accuracy
- Apply fixes and re-run until all tests pass
- Verify with all specs: `npm test -- spec1.spec.ts spec2.spec.ts ... specN.spec.ts`

## Running Tests

### Run all tests
```bash
npm test
```

### Run specific test spec
```bash
npm test e2e/packaging-specialist.spec.ts
```

### Run multiple specific specs
```bash
npm test -- e2e/retailer.spec.ts e2e/sustainability-team-member.spec.ts e2e/packaging-technologist.spec.ts e2e/packaging-specialist.spec.ts
```

### Run tests in headed mode (see browser)
```bash
npm test -- --headed
```

### Run single test within a spec
```bash
npm test -- --grep "can view products"
```

### View HTML test report
```bash
npx playwright show-report
```

## Configuration

Tests use environment variables for configuration:

- `BASE_URL` - The base URL of the application (default: `https://demo.packtrac.com`)
- `LOGIN_USERNAME` - Admin username (default: `admin@example.com`)
- `LOGIN_PASSWORD` - Admin password (default: `admin`)

Example:
```bash
BASE_URL=https://custom.url npm test
```

## Troubleshooting Common Test Failures

### Test Timeout (Increases needed)
```
Timeout 30000ms exceeded
```
**Solution:** Increase test timeout to 60 seconds:
```typescript
test.setTimeout(60000);
```

### Iframe Content Not Found
```
Frame not attached to the DOM
```
**Solution:** Add wait before accessing iframe:
```typescript
await page.waitForTimeout(3000);
const iframe = page.frameLocator('iframe[title="..."]');
```

### Button Click Blocked by Loading Overlay
```
Element is not clickable
```
**Solution:** Wait for overlay to disappear:
```typescript
await page.waitForTimeout(1000);
await button.click();
```

### Search Input Not Ready
```
Page.fill: Target page, context or browser has been closed
```
**Solution:** Wait for input visibility before filling:
```typescript
const searchInput = iframe.locator('input[placeholder="..."]');
await searchInput.waitFor({ state: "visible", timeout: 10000 });
await searchInput.fill(searchTerm);
```

## Test Results Summary

**Current Status:** All tests passing ✅

- Retailer spec: 3/3 tests passing
- Sustainability Team Member spec: 3/3 tests passing
- Packaging Technologist spec: 5/5 tests passing
- Packaging Specialist spec: 6/6 tests passing
- **Total: 17/17 tests passing**

## Future Enhancements

Potential areas for test expansion:
- Permission-based feature blocking (verify users can't access unauthorized features)
- Organizational unit filtering validation
- User permission editing and updates
- Role permission modification verification
- Multi-user concurrent access scenarios
- Performance and load testing
