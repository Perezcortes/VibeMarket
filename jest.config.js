const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Ubicación de tu app Next.js
  dir: './',
})

// Configuración personalizada
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}

module.exports = createJestConfig(customJestConfig)