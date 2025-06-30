import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    allowedHosts: ["https://frontend-production-c81e.up.railway.app/"],
  },
  server: {
    allowedHosts: ["https://frontend-production-c81e.up.railway.app/"],
  },
});
