const { tryConnect, run: runAsClient } = require("./client");
const { listen, run: runAsServer } = require("./server");
const fs = require("fs");

const SOCKET_PATH = "marionette.sock";

module.exports = () => async (container) => {
    while (true) {
        try {
            const connection = await tryConnect(SOCKET_PATH);
            if (connection) {
                return await runAsClient(container, connection)
                break;
            }
            if (connection == null && fs.existsSync(SOCKET_PATH)) {
                fs.rmSync(SOCKET_PATH)
            }

            const server = await listen(SOCKET_PATH)
            if (server) {
                runAsServer(container, server);
                break
            }
        }
        catch {
            await new Promise(resolve => setTimeout(resolve, Math.random() * 3000))

        }
    }
}