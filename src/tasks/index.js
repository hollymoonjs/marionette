const { configure } = require("@tvili999/js-container")

module.exports = configure(
    require("./tasks.js"),
    require("./taskContext.js"),
    require("./taskState.js")
)