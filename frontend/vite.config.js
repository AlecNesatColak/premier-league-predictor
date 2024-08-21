import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy requests starting with /api to the Sportmonks API
      "/api": {
        target: "http://api.football-data.org",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""), // Remove /api from the request URL
      },
    },
  },
});
