const { defineConfig } = require("@hollymoon/container")

module.exports = defineConfig(
    require("./commands"),
    require("./exec"),
    require("./multiExec")
)