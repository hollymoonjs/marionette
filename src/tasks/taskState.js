const { init } = require("@tvili999/js-container");

module.exports = init(async ({ get }) => {
    const tasks = /** @type {any} */ (await get("tasks"));
    const signals = /** @type {any} */ (await get("signals"));

    tasks.addBuilder("state", (task) => {
        Object.defineProperty(task, "state", {
            get() {
                return task._state ?? "inactive";
            },
            set(value) {
                if (task.state === value) {
                    return;
                }
                task._state = value;
                signals.fire("task:state", task);
            }
        })

        return "inactive";
    })
})