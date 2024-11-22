const { init } = require("@hollymoon/container");

module.exports = init(async ({ get }) => {
    const commands = /** @type {any} */ get("commands")
    const context = /** @type {any} */ get("context")
    const tasks = /** @type {any} */ get("tasks")

    context.addBuilder("args", () => commands.args);

    commands.addCommand("multi-exec", async (args) => {
        const execFlagIndices = args
            .map((x, i) => [x, i])
            .filter(([x]) => x === "-x")
            .map(([_, i]) => i);

        execFlagIndices.push(args.length);

        const executions = [];
        for (let i = 0; i < execFlagIndices.length - 1; i++) {
            executions.push(
                args.slice(execFlagIndices[i] + 1, execFlagIndices[i + 1])
            );
        }

        for (const execution of executions) {
            await tasks.start(...execution)
        }
    })
})