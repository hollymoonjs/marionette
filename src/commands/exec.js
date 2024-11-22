const { init } = require("@hollymoon/container");

module.exports = init(async ({ get }) => {
    const commands = /** @type {any} */ (await get("commands"))
    const context = /** @type {any} */ (await get("context"))
    const tasks = /** @type {any} */ (await get("tasks"))

    context.addBuilder("args", () => commands.args);

    commands.addCommand("exec", async (args) => {
        await tasks.start(args[0], args[1])
    })
})