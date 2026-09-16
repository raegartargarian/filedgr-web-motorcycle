import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "build", // Change the output directory to 'build'
    // @filedgr/web-core ships modern ESM only.
    target: "esnext",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    // One copy of each heavy peer, shared between the app and web-core.
    dedupe: ["react", "react-dom", "pdfjs-dist", "jszip", "three"],
  },
});
