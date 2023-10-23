const { configure } = require("@tvili999/js-container")

module.exports = configure(
    require("./commands"),
    require("./exec"),
    require("./multiExec")
)