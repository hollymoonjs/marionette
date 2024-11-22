const { defineConfig } = require("@hollymoon/container")

module.exports = defineConfig(
    require("./tasks.js"),
    require("./taskContext.js"),
    require("./taskState.js")
)