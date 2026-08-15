import { defineConfig } from "tsdown";

export default defineConfig({
    entry: {
        index: "src/index.ts",
        cli: "src/cli.ts",
        ui: "src/plugins/ui/index.ts",
    },
    format: ["esm", "cjs"],
    platform: "node",
    target: "node22",
    dts: true,
    sourcemap: true,
    clean: true,
    outDir: "dist",
});
