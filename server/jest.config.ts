import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.{test,spec}.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  globalSetup: './src/test/globalSetup.ts',
  globalTeardown: './src/test/globalTeardown.ts',
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: './tsconfig.test.json' }],
  },
};

export default config;
