const { init } = require("@hollymoon/container");

module.exports = init(async ({ get }) => {
    const contextBuilder = /** @type {any} */ get("context");
    const tasks = /** @type {any} */ get("tasks");

    contextBuilder.addBuilder("tasks", () => tasks)
    contextBuilder.addBuilder("currentTask", async (project, task) => {
        return await tasks.getTask(project, task);
    })
})