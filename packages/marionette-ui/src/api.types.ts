export interface PluginState {
    id: string;
    enabled: boolean;
}

export interface MarionetteState {
    name: string | null;
    startedAt: number;
    uptimeMs: number;
    plugins: PluginState[];
}
