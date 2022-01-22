module.exports = {
  preset: 'ts-jest',
  moduleNameMapper: {
    '^@/(.*)$': ['<rootDir>/src/$1', '<rootDir>/api/$1', '<rootDir>/mock/$1'],
    '^~/(.*)$': ['<rootDir>/src/$1', '<rootDir>/api/$1', '<rootDir>/mock/$1'],
    '^@openapi/(.*)$': ['<rootDir>/openapi/$1'],
    '^~openapi/(.*)$': ['<rootDir>/openapi/$1'],
    '^vue$': 'vue/dist/vue.common.js',
  },
  moduleFileExtensions: ['ts', 'js', 'vue', 'json'],
  testMatch: [
    '<rootDir>/src/test/**/(*.)+(spec|test).[jt]s?(x)',
    '<rootDir>/api/test/**/(*.)+(spec|test).[jt]s?(x)',
  ],
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
    // Nuxtアプリケーションで使用するもの
    '<rootDir>/src/components/**/*.vue',
    '<rootDir>/src/pages/**/*.vue',
    '<rootDir>/src/plugins/**/*.ts',
    '<rootDir>/src/modules/**/*.ts',
    '<rootDir>/src/preferences/**/*.ts',
    // サーバーミドルウェアで使用するもの
    '<rootDir>/api/bin/**/*.ts',
    '<rootDir>/api/routes/**/*.ts',
  ],
  coverageDirectory: '<rootDir>/test/unit/coverage',
  coverageReporters: ['html', 'text-summary'],

  setupFiles: ['dotenv/config', '<rootDir>/jest.setup.ts'],
}
