const treeKill = require("tree-kill")
const prefixStream = require("../helpers/prefixStream")
const childProcess = require("child_process")
const path = require("path")
const fs = require("fs");
const chokidar = require("chokidar")
const process = require("process");

module.exports = ({ command, standalone }) => {
    let subprocess = null;

    return {
        build(context) {
            return new Promise(resolve => {
                if (subprocess) {
                    subprocess.on("exit", () => {
                        resolve()
                    });
                    return;
                }
                const projectDir = context.projects[context.project].path;
                subprocess = childProcess.spawn(command, {
                    cwd: projectDir,
                    shell: true,
                    stdio: "pipe"
                });

                prefixStream(subprocess.stdout, process.stdout, context.project);
                prefixStream(subprocess.stderr, process.stderr, context.project);

                subprocess.on("exit", () => {
                    subprocess = null;
                    resolve()
                });
            })
        },
        watch(context, options, callback) {
            if (standalone) {
                return;
            }
            const basePath = context.projects[context.project].path;
            const watchPaths = fs.readdirSync(basePath)
                .filter(x => !options.excludes.includes(x))
                .map(x => path.resolve(basePath, x))
            const watcher = chokidar.watch(watchPaths, {
                ignored: options.excludes
            });

            watcher.on('change', (path) => {
                if (process.env["DEBUG"]) {
                    console.log("Changed file: ", path)
                }
                callback()
            })
        },
        async destroy(context) {
            if (standalone) {
                return;
            }
            if (!subprocess)
                return;
            await new Promise((resolve) => {
                treeKill(subprocess.pid, "SIGTERM", resolve);
            });
            await new Promise((resolve) => {
                setTimeout(resolve, 300);
            });

        }
    }
}