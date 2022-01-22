module.exports = {
  preset: 'ts-jest',
  moduleNameMapper: {
    '^@/(.*)$': ['<rootDir>/src/$1'],
    '^~/(.*)$': ['<rootDir>/src/$1'],
    '^@openapi/(.*)$': ['<rootDir>/../openapi/$1'],
    '^~openapi/(.*)$': ['<rootDir>/../openapi/$1'],
  },
  moduleFileExtensions: ['ts', 'js', 'vue', 'json'],
  testMatch: ['<rootDir>/src/test/**/(*.)+(spec|test).[jt]s?(x)'],
  transform: {
    '^.+\\.js$': 'babel-jest',
    '.*\\.(vue)$': 'vue-jest',
    '^.+\\.ts?$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/src/components/**/*.vue',
    '<rootDir>/src/pages/**/*.vue',
    '<rootDir>/src/plugins/**/*.ts',
    '<rootDir>/src/modules/**/*.ts',
    '<rootDir>/src/preferences/**/*.ts',
  ],
  coverageDirectory: '<rootDir>/test/unit/coverage',
  coverageReporters: ['html', 'text-summary'],

  setupFiles: ['dotenv/config', '<rootDir>/jest.setup.ts'],
}
