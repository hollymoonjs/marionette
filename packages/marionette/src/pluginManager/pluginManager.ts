import {
    createContainer,
    destroy,
    parent,
    type ReadyContainer,
} from "@hollymoon/container";
import { Init, Inject, Injectable, Run } from "@hollymoon/container/decorators";

import { configKey, type MarionetteConfig } from "../config/config.js";
import type { MarionettePlugin } from "./plugin.js";

@Injectable()
export class PluginManager {
    readonly #containers = new Map<MarionettePlugin, Promise<ReadyContainer>>();
    readonly #config: MarionetteConfig;
    #host: ReadyContainer | undefined;

    constructor(@Inject(configKey) config: MarionetteConfig) {
        this.#config = config;
    }

    @Init()
    init(host: ReadyContainer): void {
        this.#host = host;
    }

    @Run()
    async enableConfigured(): Promise<void> {
        for (const plugin of this.#config.plugins ?? []) {
            await this.enable(plugin);
        }
    }

    // The package does not export a `Destroy` decorator, but `Run` takes the
    // component factory to register the method with.
    @Run(destroy)
    async destroy(): Promise<void> {
        await this.disableAll();
    }

    isEnabled(plugin: MarionettePlugin): boolean {
        return this.#containers.has(plugin);
    }

    async enable(plugin: MarionettePlugin): Promise<void> {
        if (this.#containers.has(plugin)) {
            return;
        }
        if (!this.#host) {
            throw new Error(
                "Plugins can only be enabled once the marionette container is ready",
            );
        }

        // Registered before awaiting so concurrent enables of the same plugin
        // share one container.
        const container = createContainer(parent(this.#host), [
            ...plugin.components,
        ]);
        this.#containers.set(plugin, container);

        try {
            await container;
        } catch (error) {
            this.#containers.delete(plugin);
            throw error;
        }
    }

    async disable(plugin: MarionettePlugin): Promise<void> {
        const container = this.#containers.get(plugin);
        if (!container) {
            return;
        }
        this.#containers.delete(plugin);

        await (await container).destroy();
    }

    async disableAll(): Promise<void> {
        for (const plugin of [...this.#containers.keys()].reverse()) {
            await this.disable(plugin);
        }
    }
}
