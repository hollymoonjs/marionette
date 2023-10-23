const { configure } = require("@tvili999/js-container")

module.exports = configure(
    require("./signals"),
    require("./signalsContext")
)