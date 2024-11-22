const { provide, init, defineConfig } = require("@hollymoon/container");
const path = require("path");
const fs = require("fs");
const process = require("process");

const CONFIG_NAMES = ["marionette.config.js", "marionette.config.cjs"];

function getConfigPath(dir) {
    for (const configName of CONFIG_NAMES) {
        const configPath = path.join(dir, configName);
        if (fs.existsSync(configPath)) {
            return configPath;
        }
    }
    return null;
}

/**
 * @param {String} dir
 */
function discoverConfig(dir) {
    const configPath = getConfigPath(dir);
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
    const configPath = getConfigPath(projectDir);
    const mod = require(configPath);
    delete require.cache[require.resolve(configPath)];

    return mod;
}

module.exports = defineConfig(
    provide("configs", async () => {
        const configs = [];
        for (const configDir of discoverConfig(process.cwd())) {
            const config = readConfig(configDir);
            configs.push(config);
        }

        return configs;
    }),
    init(async ({ get }) => {
        const configs = /** @type {any} */ get("configs");

        for (const config of configs) {
            await config?.init?.();
        }
    })
);
