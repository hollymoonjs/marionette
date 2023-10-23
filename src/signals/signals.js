const { inject } = require("@tvili999/js-container")

module.exports = inject("signals", () => {
    const signals = {};
    const sniffers = [];

    const api = {
        sniff(sniffer) {
            sniffers.push(sniffer)
        },
        unsniff(sniffer) {
            const idx = sniffers.indexOf(sniffer);
            if (idx != -1) {
                sniffers.splice(idx, 1);
            }
        },
        on(signal, listener) {
            signals[signal] ||= []

            signals[signal].push(listener);
        },
        off(signal, listener) {
            if (!signals[signal]) {
                return;
            }

            signals[signal] = signals[signal].filter(x => x !== listener);
        },
        once(signal, listener) {
            const wrapper = function (...args) {
                listener(...args);
                api.off(signal, wrapper)
            }
            api.on(signal, wrapper)
        },
        async fire(signal, ...args) {
            for (const sniffer of sniffers) {
                await sniffer(signal, ...args);
            }
            for (const listener of signals[signal] || []) {
                await listener(...args);
            }
        },
    }
    return api;
})