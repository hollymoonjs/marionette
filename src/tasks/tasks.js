const { inject, configure, init } = require("@tvili999/js-container")
const process = require("process")

module.exports = configure(
    inject("tasks", async ({ get }) => {
        const projects = await get("projects");
        const contextBuilder = /** @type {any} */ (await get("context"));
        const signals = /** @type {any} */ (await get("signals"));

        const taskBuilders = {};

        const api = {
            /**
             * @param {string} project
             * @param {string} task
             */
            async getTask(project, task) {
                if (!projects[project]?.tasks?.[task]) {
                    console.error(`No task ${project} ${task}`)
                    process.exit(1);
                }

                const taskObj = projects[project]?.tasks?.[task];
                if (!taskObj.initialized) {
                    Object.assign(
                        taskObj,
                        { project, task, initialized: true }
                    )

                    for (const [key, builder] of Object.entries(taskBuilders)) {
                        taskObj[key] = await builder(taskObj);
                    }
                }

                return taskObj;
            },
            /**
             * @param {string} project
             * @param {string} task
             */
            async start(project, task) {
                await signals.fire("task:started", project, task);

                const taskObj = await api.getTask(project, task)

                const context = await contextBuilder.build(project, task);

                await taskObj(context);
            },
            addBuilder(key, builder) {
                taskBuilders[key] = builder
            }
        };

        return api
    })
)