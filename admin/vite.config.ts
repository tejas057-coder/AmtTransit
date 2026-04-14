import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-oxc";
import path from "path";

export default defineConfig({
  server: {
    host: "::",
    port: 5184,
    strictPort: true,
    hmr: {
      overlay: true,
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
