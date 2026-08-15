import { Inject, Injectable } from "@hollymoon/container/decorators";

import {
    configKey,
    type MarionetteConfig,
    type MarionettePlugin,
    PluginManager,
} from "@hollymoon/marionette";
import type { MarionetteState } from "../api.types.js";

@Injectable()
export class StateService {
    readonly #config: MarionetteConfig;
    readonly #plugins: PluginManager;
    readonly #startedAt = Date.now();

    constructor(
        @Inject(configKey) config: MarionetteConfig,
        @Inject(PluginManager) plugins: PluginManager,
    ) {
        this.#config = config;
        this.#plugins = plugins;
    }

    getState(): MarionetteState {
        return {
            name: this.#config.name ?? null,
            startedAt: this.#startedAt,
            uptimeMs: Date.now() - this.#startedAt,
            plugins: this.#knownPlugins().map((plugin, index) => ({
                id: `plugin-${String(index)}`,
                enabled: this.#plugins.isEnabled(plugin),
            })),
        };
    }

    #knownPlugins(): MarionettePlugin[] {
        const listed = this.#config.plugins ?? [];

        return [
            ...listed,
            ...this.#plugins.enabled.filter(
                (plugin) => !listed.includes(plugin),
            ),
        ];
    }
}
