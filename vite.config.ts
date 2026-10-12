import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { nitro } from "nitro/vite";

export default defineConfig(({ command }) => ({
  plugins: [
    tailwindcss(),
    tsconfigPaths({ projects: ["./tsconfig.json"] }),
    tanstackStart({ server: { entry: "server" } }),
    ...(command === "build" ? [nitro(process.env["VERCEL"] ? {} : { preset: "node-server" })]: []),
    react(),
  ],
  server: {
    // Pre-transform the main files at startup so the first page load doesn't wait on them.
    warmup: {
      clientFiles: ["./src/routes/*.tsx", "./src/components/store/*.tsx", "./src/lib/store/context.tsx"],
    },
  },
  resolve: {
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
}));
