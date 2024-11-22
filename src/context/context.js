const { provide } = require("@hollymoon/container")

module.exports = provide("context", async () => {
    const builders = {};

    return {
        /**
         * @param {string} project
         * @param {string} task
         */
        async build(project, task) {
            const context = { project, task };

            for (const [name, builder] of Object.entries(builders)) {
                context[name] = await builder(project, task);
            }

            return context
        },
        /**
         * @param {string} name
         * @param {any} builder
         */
        addBuilder(name, builder) {
            builders[name] = builder;
        }
    }
})