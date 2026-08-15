import type { JSX } from "react";

import type { MarionetteState } from "../../api.types.js";
import { useMarionetteState } from "./useMarionetteState.js";

export function App(): JSX.Element {
    const { state, error } = useMarionetteState();

    return (
        <main>
            <header>
                <h1>{state?.name ?? "marionette"}</h1>
                {state ? <span>up {formatUptime(state.uptimeMs)}</span> : null}
            </header>

            {error ? <p className="error">Disconnected: {error}</p> : null}

            {state ? <Plugins state={state} /> : <p>Connecting…</p>}
        </main>
    );
}

function Plugins({ state }: { state: MarionetteState }): JSX.Element {
    if (state.plugins.length === 0) {
        return <p>No plugins.</p>;
    }

    return (
        <section>
            <h2>Plugins</h2>
            <ul className="plugins">
                {state.plugins.map((plugin) => (
                    <li key={plugin.id}>
                        <span
                            className={plugin.enabled ? "dot on" : "dot off"}
                        />
                        <code>{plugin.id}</code>
                        <span className="muted">
                            {plugin.enabled ? "enabled" : "disabled"}
                        </span>
                    </li>
                ))}
            </ul>
        </section>
    );
}

function formatUptime(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
        return `${String(hours)}h ${String(minutes % 60)}m`;
    }
    if (minutes > 0) {
        return `${String(minutes)}m ${String(seconds % 60)}s`;
    }
    return `${String(seconds)}s`;
}
