import { defineConfig } from 'vite'
import dts from "vite-plugin-dts";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src", "index.ts"),
      name: "hi-profiles",
      formats: ["es", "umd"],
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
  base: "/hi-profiles",
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      include: ["src/**/*.{ts,tsx}"],
    }),
  ],
});
