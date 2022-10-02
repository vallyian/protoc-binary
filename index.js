#!/usr/bin/env node
const fs = require("fs");
const childProcess = require("child_process");
const consts = require("./consts");

// use from cmd
const args = process.argv.slice(2);
if (args.length)
    childProcess.execFileSync(consts.binary, args, { stdio: "inherit" });

// use from Node.js
module.exports = Object.freeze({
    /** Absolute path to local protoc binary */
    binary: consts.binary,

    /** Version of local protoc binary, or empty string */
    get version() { return getBinaryVersion(); },

    protoc
});

/**
 * Function wrapper for protoc binary
 * @param {string[]} args protoc arguments
 * @param {string} protoDir [optional] absolute path to dir containing .proto files
 */
function protoc(args, protoDir = process.cwd()) {
    childProcess.execFileSync(consts.binary, args, {
        stdio: "inherit",
        cwd: protoDir,
        shell: false
    });
}

function getBinaryVersion() {
    if (!fs.existsSync(consts.binary)) return "";
    let std;
    try {
        std = childProcess.execFileSync(consts.binary, ["--version"]).toString();
    } catch (ex) {
        std = "";
    }
    std = std.replace("libprotoc ", "");
    return /[0-9.]/.test(std) ? std : "";
}
