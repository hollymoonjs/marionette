import { defineConfig } from "tsdown";

export default defineConfig({
    entry: ["src/index.ts", "src/cli.ts"],
    format: ["esm", "cjs"],
    platform: "node",
    target: "node22",
    dts: true,
    sourcemap: true,
    clean: true,
    outDir: "dist",
});
