const net = require("net")
const fs = require("fs")

module.exports = {
    listen: (path) => new Promise((resolve, reject) => {
        const connection = net.createServer()

        connection.on("error", (e) => {
            if (e?.code === "EADDRINUSE") {
                resolve(null)
                return;
            }
            console.error(e);
        })
        connection.on("connection", () => {
            console.log("[SYNC] Client connected")
        })

        connection.on("close", () => {
            fs.rmSync(path);
        })
        connection.on("listening", () => {
            console.log("[SYNC] Running as server")
            resolve(connection)
        })

        connection.listen(path)
    }),
    async run({ get }, server) {
        const signals = await get("signals");
        const tasks = await get("tasks");

        let connections = [];

        let startedTasks = [];

        signals.on("task:started", (project, task) => {
            if (startedTasks.find(x => x.project === project && x.task === task))
                return;
            startedTasks.push({ project, task })
        })

        server.on("connection", async (connection) => {
            const _tasks = []
            for (const { project: projectName, task: taskName } of startedTasks) {
                const task = await tasks.getTask(projectName, taskName);
                _tasks.push({
                    project: projectName,
                    task: taskName,
                    state: task.state
                });
            }

            connection.write(JSON.stringify({
                signal: "sync:state",
                tasks: _tasks
            }) + "\n")
            connections.push(connection);
        })

        signals.on("task:state", (task) => {
            for (const connection of connections) {
                connection.write(JSON.stringify({
                    signal: "task:state",
                    project: task.project,
                    task: task.task,
                    state: task.state
                }) + "\n")
            }
        })
    }
}