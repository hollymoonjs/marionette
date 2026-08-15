import type { ComponentConfig } from "@hollymoon/container";

export interface MarionettePlugin {
    readonly $$marionettePlugin: true;
    readonly components: readonly ComponentConfig[];
}

export function createPlugin(
    ...components: ComponentConfig[]
): MarionettePlugin {
    return { $$marionettePlugin: true, components };
}

export function isPlugin(value: unknown): value is MarionettePlugin {
    return (
        typeof value === "object" &&
        value !== null &&
        "$$marionettePlugin" in value &&
        value.$$marionettePlugin === true
    );
}
