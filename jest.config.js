module.exports = {
  preset: 'ts-jest',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^~/(.*)$': '<rootDir>/src/$1',
    '^vue$': 'vue/dist/vue.common.js',
  },
  moduleFileExtensions: ['ts', 'js', 'vue', 'json'],
  testMatch: [
    '<rootDir>/src/test/**/(*.)+(spec|test).[jt]s?(x)',
    '<rootDir>/src/functions/test/**/(*.)+(spec|test).[jt]s?(x)',
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
    '<rootDir>/src/store/**/*.ts',
    // サーバーミドルウェアで使用するもの
    '<rootDir>/src/functions/bin/**/*.ts',
    '<rootDir>/src/functions/routes/**/*.ts',
  ],
  coverageDirectory: '<rootDir>/test/unit/coverage',
  coverageReporters: ['html', 'text-summary'],
}
