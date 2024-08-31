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
    port: 5173, // Ensure the server binds to the correct port in production
  },
  build: {
    outDir: 'dist', // Define the output directory for the build
    sourcemap: true, // Optional: Include sourcemaps in production builds for debugging
  },
  preview: {
    port: 5173, // Use the correct port for preview in production
  },
});

