import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api2": "http://localhost:3000",
      "/api": "https://stuneckt-api.onrender.com",
    },
  },
});
