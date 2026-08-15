import { createContainer, destroy, provide, run } from "@hollymoon/container";
import type { MarkerComponentKey, ReadyContainer } from "@hollymoon/container";
import { describe, expect, it } from "vitest";

import { configKey, type MarionetteConfig } from "../config/config.js";
import { createPlugin } from "./plugin.js";
import { PluginManager } from "./pluginManager.js";

const hostKey: MarkerComponentKey<string> = Symbol("host");

async function createHost(
    config: MarionetteConfig = {},
): Promise<ReadyContainer> {
    return createContainer(
        provide(hostKey, () => "from host"),
        provide(configKey, () => config),
        PluginManager,
    );
}

describe("PluginManager", () => {
    it("enables the plugins listed in the config", async () => {
        const order: string[] = [];
        const first = createPlugin(
            run(() => {
                order.push("first");
            }),
        );
        const second = createPlugin(
            run(() => {
                order.push("second");
            }),
        );

        const host = await createHost({ plugins: [first, second] });
        const plugins = host.get(PluginManager);

        expect(order).toEqual(["first", "second"]);
        expect(plugins.isEnabled(first)).toBe(true);
        expect(plugins.isEnabled(second)).toBe(true);
    });

    it("enables nothing when the config lists no plugins", async () => {
        const host = await createHost();

        expect(host.get(PluginManager).isEnabled(createPlugin())).toBe(false);
    });

    it("resolves keys from the host container", async () => {
        let seen: string | undefined;
        const plugin = createPlugin(
            run((container) => {
                seen = container.get(hostKey);
            }),
        );

        const host = await createHost();
        await host.get(PluginManager).enable(plugin);

        expect(seen).toBe("from host");
    });

    it("does not enable a plugin twice", async () => {
        let enabled = 0;
        const plugin = createPlugin(
            run(() => {
                enabled += 1;
            }),
        );

        const host = await createHost();
        const plugins = host.get(PluginManager);
        await Promise.all([plugins.enable(plugin), plugins.enable(plugin)]);
        await plugins.enable(plugin);

        expect(enabled).toBe(1);
        expect(plugins.isEnabled(plugin)).toBe(true);
    });

    it("destroys the plugin container on disable", async () => {
        let destroyed = 0;
        const plugin = createPlugin(
            destroy(() => {
                destroyed += 1;
            }),
        );

        const host = await createHost();
        const plugins = host.get(PluginManager);
        await plugins.enable(plugin);
        await plugins.disable(plugin);
        await plugins.disable(plugin);

        expect(destroyed).toBe(1);
        expect(plugins.isEnabled(plugin)).toBe(false);
    });

    it("can re-enable a disabled plugin", async () => {
        let enabled = 0;
        const plugin = createPlugin(
            run(() => {
                enabled += 1;
            }),
        );

        const host = await createHost();
        const plugins = host.get(PluginManager);
        await plugins.enable(plugin);
        await plugins.disable(plugin);
        await plugins.enable(plugin);

        expect(enabled).toBe(2);
    });

    it("disables enabled plugins when the host is destroyed", async () => {
        let destroyed = 0;
        const plugin = createPlugin(
            destroy(() => {
                destroyed += 1;
            }),
        );

        const host = await createHost();
        await host.get(PluginManager).enable(plugin);
        await host.destroy();

        expect(destroyed).toBe(1);
    });

    it("does not keep a plugin enabled when its container fails to build", async () => {
        const plugin = createPlugin(
            provide(() => {
                throw new Error("boom");
            }),
        );

        const host = await createHost();
        const plugins = host.get(PluginManager);

        await expect(plugins.enable(plugin)).rejects.toThrow("boom");
        expect(plugins.isEnabled(plugin)).toBe(false);
    });

    it("throws when enabling before the host container is ready", async () => {
        const plugins = new PluginManager({});
        const plugin = createPlugin();

        await expect(plugins.enable(plugin)).rejects.toThrow(
            "once the marionette container is ready",
        );
        expect(plugins.isEnabled(plugin)).toBe(false);
    });

    it("can be used standalone against any container", async () => {
        const host = await createContainer(
            provide(hostKey, () => "standalone"),
        );
        const plugins = new PluginManager({});
        plugins.init(host);

        let seen: string | undefined;
        await plugins.enable(
            createPlugin(
                run((container) => {
                    seen = container.get(hostKey);
                }),
            ),
        );

        expect(seen).toBe("standalone");
    });
});
