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

    /** Version of local protoc binary version, or empty string */
    get version() { return getBinaryVersion(); },

    protoc
});

/**
 * Function wrapper for protoc binary
 * @param {string[]} args protoc arguments
 * @param {string} protoDir [optional] absolute path to dir containing .proto files
 */
function protoc(args, protoDir = process.cwd()) {
    childProcess.execSync([consts.binary, ...args].join(" "), {
        stdio: "inherit",
        cwd: protoDir
    });
}

function getBinaryVersion() {
    try {
        return fs.existsSync(consts.binary)
            ? childProcess.execFileSync(consts.binary, ["--version"]).toString().match(/libprotoc\s(.*)\s*$/)[1]
            : "";
    } catch (ex) {
        return "";
    }
}