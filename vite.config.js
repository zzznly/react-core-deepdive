import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
  esbuild: {
    jsxFactory: "createElement",
    jsxFragment: "Fragment",
    jsxInject: `import { createElement } from '@/libs/jsx/jsx-runtime'`,
  },
  presets: ["@babel/preset-env"],
  plugins: [
    [
      "@babel/plugin-transform-react-jsx",
      {
        pragma: "createElement",
        pragmaFrag: "Fragment",
      },
    ],
  ],
});
