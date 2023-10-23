const c = require("ansi-colors")

const colors = [
    c.bgRed.whiteBright,
    c.bgYellow.black,
    c.bgGreen.black,
    c.bgMagenta.black,
    c.bgBlue.black,
    c.bgCyan.black,
]

let lastColor = 0;

const prefixColorMap = {}

module.exports = function prefixStream(inputStream, outputStream, prefix) {
    if (!prefixColorMap[prefix]) {
        prefixColorMap[prefix] = colors[lastColor];
        lastColor = (lastColor + 1) % colors.length
    }

    prefix = prefixColorMap[prefix](` ${prefix} `) + " "

    inputStream.on("data", (data) => {
        const dataStr =
            prefix +
            data.toString().trim().replaceAll("\n", `\n${prefix}`) +
            "\n";
        outputStream.write(Buffer.from(dataStr));
    });
}