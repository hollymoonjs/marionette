import { useEffect, useState } from "react";

import type { MarionetteState } from "../../api.types.js";

const POLL_INTERVAL_MS = 1000;

export interface MarionetteStateResult {
    state: MarionetteState | undefined;
    error: string | undefined;
}

export function useMarionetteState(): MarionetteStateResult {
    const [state, setState] = useState<MarionetteState>();
    const [error, setError] = useState<string>();

    useEffect(() => {
        const controller = new AbortController();

        const poll = async () => {
            try {
                const response = await fetch("/api/state", {
                    signal: controller.signal,
                });
                if (!response.ok) {
                    throw new Error(
                        `Unexpected status ${String(response.status)}`,
                    );
                }

                setState((await response.json()) as MarionetteState);
                setError(undefined);
            } catch (cause: unknown) {
                if (controller.signal.aborted) {
                    return;
                }
                setError(
                    cause instanceof Error ? cause.message : String(cause),
                );
            }
        };

        void poll();
        const timer = setInterval(() => void poll(), POLL_INTERVAL_MS);

        return () => {
            controller.abort();
            clearInterval(timer);
        };
    }, []);

    return { state, error };
}
