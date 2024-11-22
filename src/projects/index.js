const { defineConfig } = require("@hollymoon/container")

module.exports = defineConfig(
    require("./projects"),
    require("./projectContext")
)