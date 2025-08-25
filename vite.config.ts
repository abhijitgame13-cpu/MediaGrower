import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";


// Root points to the client app
export default defineConfig({
  root: "client",
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false
      }
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client/src")
    }
  },
  // Output stays inside client/dist (which the server will serve in prod)
  build: {
    outDir: "dist",
    emptyOutDir: true
  }
});
