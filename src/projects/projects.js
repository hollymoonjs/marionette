const { provide } = require("@hollymoon/container");
const path = require("path");
const fs = require("fs");
const process = require("process");

const CONFIG_NAMES = ["marionette.project.js", "marionette.project.cjs"];

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
function discoverProjects(dir) {
    const configPath = getConfigPath(dir);
    if (configPath) {
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

        const subResult = discoverProjects(childPath);
        result.push(...subResult);
    }
    return result;
}

/**
 * @param {string} projectDir
 */
function readConfig(projectDir) {
    const configPath = getConfigPath(projectDir);
    let mod = require(configPath);
    delete require.cache[require.resolve(configPath)];

    if (mod.__esModule) {
        mod = mod.default;
    }

    const config = {
        ...mod,
        path: projectDir,
    };

    if (!config.name) {
        try {
            const packageJsonPath = path.join(projectDir, "package.json");
            if (fs.existsSync(packageJsonPath)) {
                const packageJsonRaw = fs
                    .readFileSync(packageJsonPath)
                    .toString();
                const packageJson = JSON.parse(packageJsonRaw);

                config.name = packageJson.name;
            }
        } catch { }
    }

    if (!config.name) {
        console.error(`Missing name for project ${projectDir}.`);
        process.exit(1);
    }

    return config;
}

module.exports = provide("projects", async () => {
    let projects = {};
    const configChecks = [];

    for (const projectDir of discoverProjects(process.cwd())) {
        const projectConfig = readConfig(projectDir);

        for (const checker of configChecks) {
            checker(projectConfig);
        }

        projects[projectConfig.name] = projectConfig;
    }

    return projects;
});
