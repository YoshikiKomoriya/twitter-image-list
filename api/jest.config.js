module.exports = {
  preset: 'ts-jest',
  moduleNameMapper: {
    '^@/(.*)$': ['<rootDir>/$1'],
    '^~/(.*)$': ['<rootDir>/$1'],
    '^@openapi/(.*)$': ['<rootDir>/../openapi/$1'],
    '^~openapi/(.*)$': ['<rootDir>/../openapi/$1'],
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  testMatch: ['<rootDir>/test/**/(*.)+(spec|test).[jt]s?(x)'],
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.ts?$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/bin/**/*.ts', '<rootDir>/routes/**/*.ts'],
  coverageDirectory: '<rootDir>/test/unit/coverage',
  coverageReporters: ['html', 'text-summary'],

  setupFiles: ['dotenv/config'],
}
