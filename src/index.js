const { configure } = require("@tvili999/js-container");

module.exports = configure(
    require("./configs"),
    require("./plugins"),
    require("./commands"),
    require("./projects"),
    require("./tasks"),
    require("./context"),
    require("./signals")
);
