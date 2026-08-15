import {
    createContainer,
    parent,
    provide,
    type ReadyContainer,
} from "@hollymoon/container";
import express from "express";
import { afterEach, describe, expect, it } from "vitest";

import {
    configKey,
    type MarionetteConfig,
    PluginManager,
} from "@hollymoon/marionette";
import type { MarionetteState } from "./api.types.js";
import { HttpServer, serverModule } from "./server/index.js";
import { stateModule } from "./state/index.js";
import { uiOptionsKey } from "./uiOptions.js";

let containers: ReadyContainer[] = [];

async function destroyAll(): Promise<void> {
    for (const container of containers.reverse()) {
        await container.destroy();
    }
    containers = [];
}

afterEach(destroyAll);

async function startUi(config: MarionetteConfig = {}): Promise<HttpServer> {
    const host = await createContainer(
        provide(configKey, () => config),
        PluginManager,
    );
    containers.push(host);

    const plugin = await createContainer(
        parent(host),
        provide(uiOptionsKey, () => ({ port: 0, host: "127.0.0.1" })),
        serverModule,
        stateModule,
    );
    containers.push(plugin);

    return plugin.get(HttpServer);
}

describe("the ui plugin container", () => {
    it("serves the marionette state over http", async () => {
        const server = await startUi({ name: "demo" });

        const response = await fetch(`${server.url}/api/state`);
        const state = (await response.json()) as MarionetteState;

        expect(response.status).toBe(200);
        expect(state.name).toBe("demo");
        expect(state.uptimeMs).toBeGreaterThanOrEqual(0);
    });

    it("serves a placeholder while the client bundle is missing", async () => {
        const server = await startUi();

        const response = await fetch(`${server.url}/`);

        expect(response.status).toBe(503);
        expect(await response.text()).toContain("not built");
    });

    it("stops listening once the plugin container is destroyed", async () => {
        const url = (await startUi()).url;
        await destroyAll();

        await expect(fetch(`${url}/api/state`)).rejects.toThrow();
    });

    it("has no url before it listens", () => {
        const server = new HttpServer(express(), {
            port: 0,
            host: "127.0.0.1",
        });

        expect(() => server.url).toThrow("not listening");
    });
});
