import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src/"),
    },
  },
  test: {
    globals: true,
    environment: "happy-dom",
    include: ["src/**/*.test.tsx", "src/**/*.test.ts"],
    coverage: {
      reporter: ["text", "json", "html"],
    },
  },
});
