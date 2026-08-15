import {
    createContainer,
    provide,
    run,
    type ReadyContainer,
} from "@hollymoon/container";

import { configKey, type MarionetteConfig } from "./config/index.js";

export * from "./config/index.js";

export function marionette(config: MarionetteConfig): Promise<ReadyContainer> {
    return createContainer(
        provide(configKey, () => config),
        run((container) => {
            console.log(container.get(configKey));
        }),
    );
}
