const { init } = require("@hollymoon/container");

module.exports = init(async ({ get }) => {
    const commands = /** @type {any} */ (await get("commands"))
    const context = /** @type {any} */ (await get("context"))
    const tasks = /** @type {any} */ (await get("tasks"))

    context.addBuilder("args", () => commands.args);

    commands.addCommand("list", async (args) => {
        const taskList = tasks.list();

        for (const task of taskList) {
            console.log(`${task.project} ${task.task}`);
        }
    })
})