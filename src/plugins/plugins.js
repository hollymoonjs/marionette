const { init } = require("@tvili999/js-container")

module.exports = init(
    async (container) => {
        const { get } = container;
        const configs =  /** @type {any} */ (await get("configs"));

        for (const config of configs) {
            for (const plugin of config.plugins || []) {
                await plugin(container);
            }
        }
    }
)
