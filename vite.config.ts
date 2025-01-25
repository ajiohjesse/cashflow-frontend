import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, loadEnv } from "vite";
import { vitePostHog } from "vite-plugin-posthog";

// https://vitejs.dev/config/
export default ({ mode }: { mode: string }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  return defineConfig({
    plugins: [
      TanStackRouterVite({}),
      react(),
      vitePostHog({
        apiKey: process.env.VITE_POSTHOG_KEY!,
        hostUrl: process.env.VITE_POSTHOG_HOST!,
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  });
};
