const { init } = require("@tvili999/js-container");

module.exports = init(async ({ get }) => {
    const contextBuilder = /** @type {any} */ (await get("context"));
    const tasks = /** @type {any} */ (await get("tasks"));

    contextBuilder.addBuilder("tasks", () => tasks)
    contextBuilder.addBuilder("currentTask", async (project, task) => {
        return await tasks.getTask(project, task);
    })
})