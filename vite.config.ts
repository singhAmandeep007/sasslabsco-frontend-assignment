/// <reference types="vitest" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    root: "./src",
    globals: false,
    // https://vitest.dev/config/#environment
    environment: "jsdom",
    setupFiles: ["./testSetup.ts"],
    testTimeout: 5000,
    // READ-MORE: https://vitest.dev/config/#css
    css: {
      modules: {
        // process CSS files and do not hash class names
        // READ-MORE: https://vitest.dev/config/#css-modules-classnamestrategy
        classNameStrategy: "non-scoped",
      },
      // READ-MORE: https://vitest.dev/config/#css-include
      include: /\.(scss|sass|css)$/,
    },
    // teardown
    // Calls mockClear (Clears all information about every call) before every test. This will clear mock history and reset its implementation to an empty function (will return undefined). Completely reset a mock to the default state.
    // READ-MORE: https://vitest.dev/config/#mockreset
    mockReset: true,
  },
  base: "/funding-table-app",
});
