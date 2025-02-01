import { defineConfig } from "vite";
import path from "path";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
  esbuild: {
    jsx: "transform",
    jsxDev: false,
    jsxImportSource: "@/libs/jsx",
    jsxInject: `import { createElement } from '@/libs/jsx/jsx-runtime'`,
    jsxFactory: "createElement",
    jsxFragment: "Fragment",
  },
});
