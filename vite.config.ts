import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 8080,
    strictPort: true,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/jspdf")) return "pdf";
          if (id.includes("node_modules/html2canvas")) return "html2canvas";
          if (id.includes("node_modules/@supabase/supabase-js")) return "supabase";
          if (id.includes("node_modules/framer-motion")) return "motion";
          if (id.includes("node_modules/lucide-react")) return "icons";
          if (id.includes("node_modules/@tanstack/react-query")) return "query";
          if (id.includes("node_modules/react-router-dom")) return "router";
          if (id.includes("node_modules/recharts")) return "charts";
          if (
            id.includes("node_modules/@radix-ui/react-dialog") ||
            id.includes("node_modules/@radix-ui/react-dropdown-menu") ||
            id.includes("node_modules/@radix-ui/react-select")
          ) return "ui";
          if (
            id.includes("node_modules/clsx") ||
            id.includes("node_modules/tailwind-merge") ||
            id.includes("node_modules/class-variance-authority")
          ) return "utils";
          if (
            id.includes("node_modules/react-hook-form") ||
            id.includes("node_modules/@hookform/resolvers")
          ) return "forms";
          if (id.includes("node_modules/date-fns")) return "date";
          if (id.includes("node_modules/react") || id.includes("node_modules/react-dom")) return "vendor";
        },
      },
    },
  },
}));
