const { init } = require("@hollymoon/container");

module.exports = init(async ({ get }) => {
    const contextBuilder = /** @type {any} */ get("context");
    const signals = get("signals");

    contextBuilder.addBuilder("signals", () => signals)
})