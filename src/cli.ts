#!/usr/bin/env node
import { constants } from "node:os";

import type { ReadyContainer } from "@hollymoon/container";

import { marionette } from "./index.js";

const SHUTDOWN_SIGNALS = ["SIGINT", "SIGTERM"] as const;

function destroyOnSignal(container: ReadyContainer): void {
    let shuttingDown = false;

    const shutdown = (signal: NodeJS.Signals) => {
        if (shuttingDown) {
            return;
        }
        shuttingDown = true;

        container.destroy().then(
            () => {
                process.exit(128 + constants.signals[signal]);
            },
            (error: unknown) => {
                console.error(error);
                process.exit(1);
            },
        );
    };

    for (const signal of SHUTDOWN_SIGNALS) {
        process.on(signal, shutdown);
    }
}

async function main(): Promise<void> {
    const container = await marionette();
    destroyOnSignal(container);
}

main().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
});
