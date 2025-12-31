const { init } = require("@hollymoon/container")

module.exports = init(
    async (container) => {
        const { get } = container;
        const { configs } =  /** @type {any} */ get("configs");

        for (const config of configs) {
            for (const plugin of config.plugins || []) {
                await plugin(container);
            }
        }
    }
)
