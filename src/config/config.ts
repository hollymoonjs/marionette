import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

import type { MarkerComponentKey } from "@hollymoon/container";

import type { MarionettePlugin } from "../pluginManager/plugin.js";

export interface MarionetteConfig {
    name?: string;
    plugins?: MarionettePlugin[];
}

export function defineConfig(config: MarionetteConfig): MarionetteConfig {
    return config;
}

/** Container key the loaded config is provided under. */
export const configKey: MarkerComponentKey<MarionetteConfig> =
    Symbol("marionette.config");

const CONFIG_FILE_NAMES = [
    "marionette.config.ts",
    "marionette.config.js",
    "marionette.config.mjs",
    "marionette.config.cjs",
];

/**
 * Walks up from `from` until a config file is found, or the filesystem root is
 * reached.
 */
export function findConfigFile(from: string): string | undefined {
    let directory = resolve(from);

    for (;;) {
        for (const name of CONFIG_FILE_NAMES) {
            const candidate = join(directory, name);
            if (existsSync(candidate)) {
                return candidate;
            }
        }

        const parent = dirname(directory);
        if (parent === directory) {
            return undefined;
        }

        directory = parent;
    }
}

export async function loadConfig(file: string): Promise<MarionetteConfig> {
    const imported: unknown = await import(pathToFileURL(file).href);

    if (
        typeof imported !== "object" ||
        imported === null ||
        !("default" in imported)
    ) {
        throw new Error(`Config file "${file}" has no default export`);
    }

    return imported.default as MarionetteConfig;
}
