import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    allowedHosts: ["frontend-production-c81e.up.railway.app"],
  },
  server: {
    allowedHosts: ["frontend-production-c81e.up.railway.app"],
  },
});
