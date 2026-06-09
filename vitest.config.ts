import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['etl/__tests__/**/*.test.ts', 'src/**/*.test.{ts,tsx}'],
  },
})
