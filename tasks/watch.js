function debounce(func, delay) {
    let timeoutId;

    return function (...args) {
        clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

function taskState(context, dependencies, callback) {
    const taskStates = {}
    context.signals.on("task:state", (task) => {
        if (!dependencies.find(x => x.project === task.project && x.task == task.task))
            return;
        // TODO: Implement it correctly (without semicolon, a semicolon in names can confuse it)

        if (taskStates[`${task.project}:${task.task}`] !== task.state) {
            taskStates[`${task.project}:${task.task}`] = task.state;

            callback(taskStates);
        }
    })
}


module.exports = (options) => async (context) => {
    let { dependencies, executor } = options
    async function run() {
        context.currentTask.state = "running";
        await executor.build(context);
        await new Promise(resolve => setTimeout(resolve, 100))
        context.currentTask.state = "done";
    }

    if (context.currentTask.state !== "inactive")
        return;
    context.currentTask.state = "pending"

    dependencies ||= []

    let _taskStates = {};
    taskState(context, dependencies, (taskStates) => {
        _taskStates = taskStates;
        if (Object.values(taskStates).some(x => x === "pending" || x === "running")) {
            context.currentTask.state = "pending"
            executor?.destroy?.(context);
        }
        if (!Object.values(taskStates).some(x => x !== "done")) {
            run();
        }
    })

    for (const dep of dependencies) {
        await context.tasks.start(dep.project, dep.task)
    }

    if (dependencies.length == 0) {
        run();
    }

    executor.watch(context, options, debounce(async () => {
        if (context.currentTask.state === "pending") {
            return;
        }
        const isRunnning = context.currentTask.state === "running"

        context.currentTask.state = "pending";
        if (isRunnning) {
            await executor?.destroy?.(context);
        }


        if (!Object.values(_taskStates).some(x => x !== "done")) {
            run();
        }
    }, 300))
}
