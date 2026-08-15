import { defineConfig } from "@hollymoon/container";

import { apiRouter } from "./apiRouter.js";
import { ClientRoute } from "./clientRoute.js";
import { expressApp } from "./expressApp.js";
import { HttpServer } from "./httpServer.js";

export const serverModule = defineConfig(
    apiRouter,
    expressApp,
    ClientRoute,
    HttpServer,
);

export { apiRouterKey } from "./apiRouter.js";
export { appKey } from "./expressApp.js";
export { HttpServer } from "./httpServer.js";
