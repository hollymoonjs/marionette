import type { MarkerComponentKey } from "@hollymoon/container";

export interface UiOptions {
    port?: number;
    host?: string;
}

export interface ResolvedUiOptions {
    port: number;
    host: string;
}

export const uiOptionsKey: MarkerComponentKey<ResolvedUiOptions> = Symbol(
    "marionette.ui.options",
);

const DEFAULT_PORT = 4000;
const DEFAULT_HOST = "127.0.0.1";

export function resolveUiOptions(options: UiOptions): ResolvedUiOptions {
    return {
        port: options.port ?? DEFAULT_PORT,
        host: options.host ?? DEFAULT_HOST,
    };
}
