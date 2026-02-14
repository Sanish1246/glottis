/// <reference types="vitest/config" />
import { defineConfig, mergeConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import viteConfig from './vite.config'

export default mergeConfig(viteConfig, defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['tests/unit/**/*.test.{js,ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['utils/**/*.js', 'src/lib/**/*.ts'],
      exclude: ['**/*.test.{js,ts,tsx}', '**/*.spec.{js,ts}', 'node_modules'],
    },
  },
})) 