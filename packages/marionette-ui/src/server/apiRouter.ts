import { provide } from "@hollymoon/container";
import type { Component, MarkerComponentKey } from "@hollymoon/container";
import { Router } from "express";

export const apiRouterKey: MarkerComponentKey<Router> = Symbol(
    "marionette.ui.apiRouter",
);

export const apiRouter: Component<Router> = provide(apiRouterKey, () =>
    Router(),
);
