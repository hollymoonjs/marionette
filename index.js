#!/usr/bin/env node
const { createContainer } = require("@hollymoon/container");

createContainer(require("./src")).catch(console.error);
