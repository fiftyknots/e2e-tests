# E2E Test Suite - User Role Tests

This test suite validates user authentication and role-based access for the PackTrac application.

## Test Structure

- **login.spec.ts** - Basic login functionality test
- **roles.spec.ts** - Tests for each pre-defined user role

## Role Test Users

The `roles.spec.ts` file defines test users for each of the six pre-defined roles. Each test:

1. Logs in as admin
2. Navigates to User Management and verifies the test user exists with the correct role
3. Logs out
4. Logs in as the test user to confirm they can access the system

### Test Users to Create

Before running the role tests, you must create the following users in the User Management section as the admin user:

**Important:** For **Organizational Units**, select only the **first available unit** when creating each user. The available units vary by environment, so hard-coding specific unit names isn't reliable across different deployments. Nested units under the first selection will be automatically included.

#### 1. Sustainability Team Member
- **Email:** `sustainability.member@packtrac.com`
- **Password:** `password`
- **Full Name:** `Sustainability Team Member Test`
- **Role:** Sustainability Team Member
- **Permissions:**
  - View Packaging Items
  - View Products
  - View Specifications
  - View Suppliers
  - Export Reports
- **Organizational Units:** None

#### 2. Packaging Technologist
- **Email:** `packaging.tech@packtrac.com`
- **Password:** `password`
- **Full Name:** `Packaging Technologist Test`
- **Role:** Packaging Technologist
- **Permissions:**
  - Edit Packaging Items
  - View Packaging Items
  - Load Products
  - View Products
  - View Specifications
  - View Suppliers
- **Organizational Units:**
  - Select the first available organizational unit

#### 3. QA Technologist
- **Email:** `qa.tech@packtrac.com`
- **Password:** `password`
- **Full Name:** `QA Technologist Test`
- **Role:** QA Technologist
- **Permissions:**
  - View Packaging Items
  - View Products
  - View Specifications
  - View Suppliers
- **Organizational Units:**
  - Select the first available organizational unit

#### 4. Packaging Specialist
- **Email:** `packaging.specialist@packtrac.com`
- **Password:** `password`
- **Full Name:** `Packaging Specialist Test`
- **Role:** Packaging Specialist
- **Permissions:**
  - Manage Users
  - Edit Packaging Items
  - View Packaging Items
  - Load Products
  - View Products
  - Manage Specifications
  - View Specifications
  - Manage Suppliers
  - View Suppliers
- **Organizational Units:**
  - Select the first available organizational unit

#### 5. Retailer
- **Email:** `retailer@packtrac.com`
- **Password:** `password`
- **Full Name:** `Retailer User Test`
- **Role:** Retailer
- **Permissions:**
  - View Products
  - Import Sales Data
- **Organizational Units:** None

## Running Tests

### Run all tests
```bash
npm test
```

### Run only role tests
```bash
npm test -- roles.spec.ts
```

### Run only login test
```bash
npm test -- login.spec.ts
```

### Run tests in headed mode (see browser)
```bash
npm test -- --headed
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

## Next Steps

Once all tests pass with successful user logins, we will add authorization tests to verify:

- Each user can access the features they have permission for
- Each user cannot access features they don't have permission for
- Organizational unit restrictions are enforced
