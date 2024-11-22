const { init } = require("@hollymoon/container");

module.exports = init(async ({ get }) => {
    const contextBuilder = /** @type {any} */ get("context");
    const projects = get("projects");

    contextBuilder.addBuilder("projects", () => projects)
})