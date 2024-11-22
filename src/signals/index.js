const { defineConfig } = require("@hollymoon/container")

module.exports = defineConfig(
    require("./signals"),
    require("./signalsContext")
)