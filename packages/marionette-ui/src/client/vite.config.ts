import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const here = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
    root: here("."),
    plugins: [react()],
    build: {
        outDir: here("../../dist/client"),
        emptyOutDir: true,
    },
    server: {
        port: 4001,
        proxy: {
            "/api": "http://127.0.0.1:4000",
        },
    },
});
