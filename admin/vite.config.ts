// vite config
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-oxc";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  server: {
    host: "::",
    port: 5184,
    strictPort: false,
    hmr: {
      overlay: true,
    },
  },
  plugins: [
    tailwindcss(),
    react()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react-leaflet", "leaflet"],
  },
});
 
