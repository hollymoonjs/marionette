import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";

import { destroy } from "@hollymoon/container";
import { Inject, Injectable, Run } from "@hollymoon/container/decorators";
import type { Express } from "express";

import { type ResolvedUiOptions, uiOptionsKey } from "../uiOptions.js";
import { appKey } from "./expressApp.js";

@Injectable()
export class HttpServer {
    readonly #app: Express;
    readonly #options: ResolvedUiOptions;
    #server: Server | undefined;

    constructor(
        @Inject(appKey) app: Express,
        @Inject(uiOptionsKey) options: ResolvedUiOptions,
    ) {
        this.#app = app;
        this.#options = options;
    }

    get url(): string {
        const server = this.#server;
        if (!server) {
            throw new Error("The marionette UI server is not listening");
        }

        const address = server.address() as AddressInfo;
        return `http://${this.#options.host}:${String(address.port)}`;
    }

    // Routes mount themselves during init, so by the time any run method is
    // called the app is complete.
    @Run()
    async start(): Promise<void> {
        const server = createServer(this.#app);
        await listen(server, this.#options);
        this.#server = server;

        console.log(`[marionette:ui] listening on ${this.url}`);
    }

    @Run(destroy)
    async stop(): Promise<void> {
        const server = this.#server;
        if (!server) {
            return;
        }
        this.#server = undefined;

        server.closeIdleConnections();
        await new Promise<void>((resolve, reject) => {
            server.close((error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }
}

function listen(server: Server, options: ResolvedUiOptions): Promise<void> {
    return new Promise((resolve, reject) => {
        server.once("error", reject);
        server.listen(options.port, options.host, () => {
            server.removeListener("error", reject);
            resolve();
        });
    });
}
