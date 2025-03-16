import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import postcssNesting from "postcss-nesting"; // Import the PostCSS nesting plugin


export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
      },
    },
  },
  build: {
    outDir: "dist", 
  },
  css: {
    postcss: {
      plugins: [postcssNesting()],
    },
  },
});
