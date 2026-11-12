import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

// GSAP opsional: jika paketnya tidak ter-install, alihkan import "gsap" ke fallback kosong
const hasGsap = existsSync(
  fileURLToPath(new URL("./node_modules/gsap/package.json", import.meta.url))
);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: hasGsap
      ? {}
      : { gsap: fileURLToPath(new URL("./src/lib/gsapFallback.ts", import.meta.url)) },
  },
  server: { port: 5173 },
});