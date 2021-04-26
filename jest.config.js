module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  globals: {
    window: true
  },
  "coverageReporters": ["json-summary"],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/lib/',
    '__tests__/fixtures/',
    '__tests__/helpers',
  ],
};
