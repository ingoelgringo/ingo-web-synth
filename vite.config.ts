import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/ingo-web-synth/", // ← EXAKT repo-namnet
});
