const { inject, init, configure } = require("@tvili999/js-container")
const path = require("path")
const fs = require("fs")
const process = require("process")

const CONFIG_NAME = "marionette.config.js"

/**
 * @param {String} dir
 */
function discoverConfig(dir) {
    const configPath = path.join(dir, CONFIG_NAME);
    if (fs.existsSync(configPath)) {
        return [dir];
    }

    if (!fs.statSync(dir).isDirectory()) {
        return null;
    }

    let result = [];
    for (const childName of fs.readdirSync(dir)) {
        const childPath = path.join(dir, childName);
        const stat = fs.statSync(childPath);
        if (!stat.isDirectory()) {
            continue;
        }

        if (childName == "node_modules") {
            continue;
        }

        const subResult = discoverConfig(childPath);
        result.push(...subResult);
    }
    return result;
}

/**
 * @param {string} projectDir
 */
function readConfig(projectDir) {
    const configPath = path.join(projectDir, CONFIG_NAME)
    const mod = require(configPath);
    delete require.cache[require.resolve(configPath)];

    return mod;
}


module.exports = configure(
    inject("configs", async () => {
        const configs = [];
        for (const configDir of discoverConfig(process.cwd())) {
            const config = readConfig(configDir);
            configs.push(config);
        }

        return configs;
    }),
    init(async ({ get }) => {
        const configs = /** @type {any} */ (await get("configs"));

        for (const config of configs) {
            await config?.init?.();
        }
    })
)
