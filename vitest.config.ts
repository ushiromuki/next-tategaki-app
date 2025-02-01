import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "happydom",
    coverage: {
      reporter: ["text", "json", "html"],
    },
  },
});
