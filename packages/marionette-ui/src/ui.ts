import { provide } from "@hollymoon/container";

import { createPlugin, type MarionettePlugin } from "@hollymoon/marionette";

import { serverModule } from "./server/index.js";
import { stateModule } from "./state/index.js";
import { resolveUiOptions, type UiOptions, uiOptionsKey } from "./uiOptions.js";

export function ui(options: UiOptions = {}): MarionettePlugin {
    const resolved = resolveUiOptions(options);

    return createPlugin(
        provide(uiOptionsKey, () => resolved),
        serverModule,
        stateModule,
    );
}
