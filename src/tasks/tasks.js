const { provide, defineConfig } = require("@hollymoon/container")
const process = require("process")

module.exports = defineConfig(
    provide("tasks", async ({ inject }) => {
        const projects = await inject("projects");
        const contextBuilder = /** @type {any} */ (await inject("context"));
        const signals = /** @type {any} */ (await inject("signals"));

        const taskBuilders = {};

        const api = {
            list() {
                const result = [];

                for (const [projectName, project] of Object.entries(projects)) {
                    for (const [taskName, task] of Object.entries(project.tasks)) {
                        result.push({ project: projectName, task: taskName })
                    }
                }

                return result;
            },
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