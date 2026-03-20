/**
 * Test credentials configuration
 * Load credentials from environment variables
 */

export const testCredentials = {
  admin: {
    email: process.env.TEST_ADMIN_EMAIL || 'packtrac-admin@acumen.zone',
    password: process.env.TEST_ADMIN_PASSWORD || 'yeAr1y-rem3dial-acce$$',
  },
  packagingSpecialist: {
    email: process.env.TEST_PACKAGING_SPECIALIST_EMAIL || 'packaging.specialist@packtrac.com',
    password: process.env.TEST_PACKAGING_SPECIALIST_PASSWORD || 'password',
  },
  packagingTechnologist: {
    email: process.env.TEST_PACKAGING_TECHNOLOGIST_EMAIL || 'packaging.tech@packtrac.com',
    password: process.env.TEST_PACKAGING_TECHNOLOGIST_PASSWORD || 'password',
  },
  qaTechnologist: {
    email: process.env.TEST_QA_TECHNOLOGIST_EMAIL || 'qa.tech@packtrac.com',
    password: process.env.TEST_QA_TECHNOLOGIST_PASSWORD || 'password',
  },
  retailer: {
    email: process.env.TEST_RETAILER_EMAIL || 'retailer@packtrac.com',
    password: process.env.TEST_RETAILER_PASSWORD || 'password',
  },
  sustainability: {
    email: process.env.TEST_SUSTAINABILITY_EMAIL || 'sustainability@packtrac.com',
    password: process.env.TEST_SUSTAINABILITY_PASSWORD || 'password',
  },
};
