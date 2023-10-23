#!/usr/bin/env node
const { default: container } = require("@tvili999/js-container");

container(require("./src")).catch(console.error);
