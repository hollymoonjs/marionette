import { destroy, run } from "@hollymoon/container";

import {
    createPlugin,
    type MarionettePlugin,
} from "../../pluginManager/index.js";

export function ui(): MarionettePlugin {
    return createPlugin(
        run(() => {
            console.log("[marionette:ui] enabled");
        }),
        destroy(() => {
            console.log("[marionette:ui] disabled");
        }),
    );
}
