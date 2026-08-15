import { createContainer, provide } from "@hollymoon/container";
import { describe, expect, it } from "vitest";

import { createPlugin, PluginManager } from "@hollymoon/marionette";
import { StateService } from "./stateService.js";

async function createPluginManager(): Promise<PluginManager> {
    const host = await createContainer(provide("host", () => "host"));
    const plugins = new PluginManager({});
    plugins.init(host);

    return plugins;
}

describe("StateService", () => {
    it("reports the configured plugins with their enabled state", async () => {
        const first = createPlugin();
        const second = createPlugin();
        const plugins = await createPluginManager();
        await plugins.enable(first);

        const service = new StateService(
            { name: "demo", plugins: [first, second] },
            plugins,
        );
        const state = service.getState();

        expect(state.name).toBe("demo");
        expect(state.uptimeMs).toBeGreaterThanOrEqual(0);
        expect(state.plugins).toEqual([
            { id: "plugin-0", enabled: true },
            { id: "plugin-1", enabled: false },
        ]);
    });

    it("reports plugins enabled outside the config", async () => {
        const plugins = await createPluginManager();
        await plugins.enable(createPlugin());

        const state = new StateService({}, plugins).getState();

        expect(state.name).toBeNull();
        expect(state.plugins).toEqual([{ id: "plugin-0", enabled: true }]);
    });
});
