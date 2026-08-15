import { provide } from "@hollymoon/container";
import type { Component, MarkerComponentKey } from "@hollymoon/container";
import express, { type Express } from "express";

import { apiRouterKey } from "./apiRouter.js";

export const appKey: MarkerComponentKey<Express> = Symbol("marionette.ui.app");

export const expressApp: Component<Express> = provide(
    appKey,
    async (container) => {
        const app = express();
        app.use("/api", await container.inject(apiRouterKey));

        return app;
    },
);
