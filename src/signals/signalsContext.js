const { init } = require("@tvili999/js-container");

module.exports = init(async ({ get }) => {
    const contextBuilder = /** @type {any} */ (await get("context"));
    const signals = await get("signals");

    contextBuilder.addBuilder("signals", () => signals)
})