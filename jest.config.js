const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Indica dónde está tu app Next.js (la raíz)
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',

  // Esto le dice a Jest: "Cuando veas @/, busca en la carpeta src/"
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  // --- 2. IGNORAR PLAYWRIGHT ---
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/e2e/"],
}

module.exports = createJestConfig(customJestConfig)