import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import Sitemap from "vite-plugin-sitemap";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/bgg-explorer/",
  plugins: [
    react(),
    Sitemap({
      hostname: "https://watabean.github.io",
      basePath: "/bgg-explorer",
    }),
  ],
});
