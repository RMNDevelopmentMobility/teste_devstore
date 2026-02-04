module.exports = {
  preset: 'jest-expo',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts', '**/__tests__/**/*.test.tsx'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@features/(.*)$': '<rootDir>/src/features/$1',
    '^@design-system$': '<rootDir>/src/design_system/index.ts',
    '^@design-system/(.*)$': '<rootDir>/src/design_system/$1',
    '^@core/(.*)$': '<rootDir>/src/core/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|fp-ts)',
  ],
  collectCoverageFrom: [
    'src/features/**/domain/**/*.ts',
    'src/features/**/data/**/*.ts',
    'src/features/**/external/**/*.ts',
    'src/features/**/presentation/hooks/**/*.ts',
    // Exclude interfaces (no executable code)
    '!src/features/**/domain/repositories/*.ts',
    '!src/features/**/data/datasources/ProductRemoteDataSource.ts',
    // Exclude screens and components (require complex setup with navigation mocks)
    '!src/features/**/presentation/screens/**/*.tsx',
    '!src/features/**/presentation/components/**/*.tsx',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
};
