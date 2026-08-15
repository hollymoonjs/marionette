import {
    createContainer,
    provide,
    type ReadyContainer,
} from "@hollymoon/container";

import { configKey, type MarionetteConfig } from "./config/index.js";
import { PluginManager } from "./pluginManager/index.js";

export * from "./config/index.js";
export * from "./pluginManager/index.js";

export function marionette(config: MarionetteConfig): Promise<ReadyContainer> {
    return createContainer(
        provide(configKey, () => config),
        PluginManager,
    );
}
