const { defineConfig } = require("@hollymoon/container");

module.exports = defineConfig(
    require("./configs"),
    require("./plugins"),
    require("./commands"),
    require("./projects"),
    require("./tasks"),
    require("./context"),
    require("./signals")
);
