import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { Init, Inject, Injectable } from "@hollymoon/container/decorators";
import express, { type Express, type RequestHandler } from "express";

import { appKey } from "./expressApp.js";

// Resolved against the bundle, not the source tree: the ui entry is emitted as
// `dist/ui.mjs` and vite builds the client into `dist/client`. Running from
// `src` there is no sibling `client/`, so the placeholder below is served.
export const clientDirectory = fileURLToPath(
    new URL("client/", import.meta.url),
);

const PLACEHOLDER = `<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <title>marionette</title>
    </head>
    <body>
        <h1>The marionette UI is not built</h1>
        <p>Run <code>pnpm build:client</code> in the marionette package.</p>
    </body>
</html>
`;

@Injectable()
export class ClientRoute {
    readonly #app: Express;

    constructor(@Inject(appKey) app: Express) {
        this.#app = app;
    }

    @Init()
    mount(): void {
        const indexFile = join(clientDirectory, "index.html");

        if (!existsSync(indexFile)) {
            this.#app.use(
                onlyGet((_request, response) => {
                    response.status(503).type("html").send(PLACEHOLDER);
                }),
            );
            return;
        }

        this.#app.use(express.static(clientDirectory));
        this.#app.use(
            onlyGet((_request, response) => {
                response.sendFile(indexFile);
            }),
        );
    }
}

function onlyGet(handler: RequestHandler): RequestHandler {
    return (request, response, next) => {
        if (request.method !== "GET") {
            next();
            return;
        }

        handler(request, response, next);
    };
}
