const prefixStream = require("../helpers/prefixStream");
const childProcess = require("child_process");
const process = require("process");

module.exports =
    ({ command, dependencies, bail }) =>
    async (context) => {
        if (context.currentTask.state !== "inactive") return;
        context.currentTask.state = "pending";

        function run() {
            context.currentTask.state = "running";
            const projectDir = context.projects[context.project].path;
            const subprocess = childProcess.spawn(command, {
                cwd: projectDir,
                shell: true,
                stdio: "pipe",
            });

            prefixStream(subprocess.stdout, process.stdout, context.project);
            prefixStream(subprocess.stderr, process.stderr, context.project);

            subprocess.on("exit", (code) => {
                if (code !== 0 && bail) {
                    process.exit(code);
                }
                context.currentTask.state = "done";
            });
        }

        dependencies ||= [];

        const taskStates = {};
        for (const dep of dependencies) {
            const task = await context.tasks.getTask(dep.project, dep.task);
            taskStates[`${dep.project}:${dep.task}`] = task.state;
        }


        context.signals.on("task:state", (task) => {
            if (
                !dependencies.find(
                    (x) => x.project === task.project && x.task == task.task
                )
            )
                return;
            // TODO: Implement it correctly (without semicolon, a semicolon in names can confuse it)
            taskStates[`${task.project}:${task.task}`] = task.state;

            if (!Object.values(taskStates).some((x) => x !== "done")) {
                run();
            }
        });

        for (const dep of dependencies) {
            await context.tasks.start(dep.project, dep.task);
        }
        if (dependencies.length === 0) {
            run();
        }
    };
