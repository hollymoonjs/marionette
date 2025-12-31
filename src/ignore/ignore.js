const ignore = require("ignore");
const fs = require("fs");
const path = require("path");

/**
 * Creates an ignore instance that respects .gitignore and custom excludes
 * @param {string} baseDir - The base directory to look for .gitignore
 * @param {string[]} [customExcludes=[]] - Additional patterns to exclude
 * @returns {import("ignore").Ignore}
 */
function createIgnore(baseDir, customExcludes = []) {
    const ig = ignore();

    // Read .gitignore if it exists
    const gitignorePath = path.join(baseDir, ".gitignore");
    if (fs.existsSync(gitignorePath)) {
        const gitignoreContent = fs.readFileSync(gitignorePath, "utf-8");
        ig.add(gitignoreContent);
    }

    // Add custom excludes
    if (customExcludes.length > 0) {
        ig.add(customExcludes);
    }

    return ig;
}

/**
 * Checks if a path should be ignored
 * @param {import("ignore").Ignore} ig - The ignore instance
 * @param {string} baseDir - The base directory for relative path calculation
 * @param {string} absolutePath - The absolute path to check
 * @returns {boolean}
 */
function shouldIgnore(ig, baseDir, absolutePath) {
    const relativePath = path.relative(baseDir, absolutePath);
    // ignore package requires forward slashes and no leading ./
    const normalizedPath = relativePath.split(path.sep).join("/");
    return ig.ignores(normalizedPath);
}

module.exports = {
    createIgnore,
    shouldIgnore,
};
