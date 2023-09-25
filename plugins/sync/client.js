const fs = require("fs")
const net = require("net")

module.exports = {
    tryConnect: (path) => new Promise((resolve, reject) => {
        if (!fs.existsSync(path)) {
            resolve(null)
            return;
        }

        const client = net.createConnection(path);
        client.on('error', (e) => {
            if (e?.code == "ECONNREFUSED") {
                resolve(null);
                return
            }
            console.error(e)
        })

        client.on('connect', () => {
            console.log("[SYNC] Running as client")
            resolve(client)
        })
    }),
    async run({ get }, connection) {
        const projects = await get("projects");
        const tasks = await get("tasks");
        const signals = await get("signals");

        let unlockStart = null;
        let commandLock = new Promise(resolve => {
            unlockStart = resolve;
        })

        let delegatedTasks = [];
        async function onMessage(data) {
            if (data.signal === "sync:state") {
                delegatedTasks = data.tasks;
                for (const { project: projectName, task: taskName } of data.tasks) {
                    const project = projects[projectName];

                    project.tasks[taskName] = async function () {
                        connection.write(JSON.stringify({
                            signal: "sync:start",
                            task: taskName,
                            project: projectName
                        }))
                    }
                    project.tasks[taskName].delegated = true;
                }

                unlockStart();
            }

            if (data.signal === "task:state") {
                const task = await tasks.getTask(data.project, data.task)

                task.state = data.state
            }

        }

        connection.on("data", async (msg) => {
            const rawLines = msg.toString().split("\n").filter(x => x);
            try {
                for (const line of rawLines) {
                    const data = JSON.parse(line.toString())
                    await onMessage(data);
                }
            }
            catch (e) {
                console.log("######", rawLines, "$$$$");
                console.error(e);
            }
        })


        signals.on("command:beforeRun", () => commandLock)
        signals.on("command:afterRun", async () => {
            for (const { project: projectName, task: taskName, state } of delegatedTasks) {
                const task = await tasks.getTask(projectName, taskName);

                task.state = state
            }
        })
    }
}