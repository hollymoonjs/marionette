const { inject, configure, run } = require("@tvili999/js-container");
const process = require("process");

module.exports = configure(
    inject("commands", async () => {
        const commands = {};

        const api = {
            addCommand(name, executor) {
                commands[name] = executor
            },
            async run(commandName) {
                const command = commands[commandName];
                if (!command) {
                    console.error("No such command!")
                    process.exit(1);
                }

                await command(api.args)
            },
            get args() {
                return process.argv.slice(3);
            }
        }

        return api;
    }),
    run(async (container) => {
        const { get } = container;
        const signals = /** @type {any} */ (await get("signals"));
        const commands = /** @type {any} */ (await get("commands"));

        await signals.fire("command:beforeRun", process.argv[2])

        await commands.run(process.argv[2]);

        await signals.fire("command:afterRun", process.argv[2])
    })
)