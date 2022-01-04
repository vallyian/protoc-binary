const path = require("path");

const binaryZip = {
    "darwin-x64": "osx-x86_64.zip",
    "linux-x32": "linux-x86_32.zip",
    "linux-x64": "linux-x86_64.zip",
    "win32-x32": "win32.zip",
    "win32-x64": "win64.zip"
}[process.platform + "-" + process.arch];

const binaryUrl = "https://api.github.com/repos/protocolbuffers/protobuf/releases/latest"
const protocDir = path.join(__dirname, "./protoc");
const binary = path.join(protocDir, "bin", `protoc${process.platform === "win32" ? ".exe" : ""}`);

module.exports = Object.freeze({
    binaryZip,
    binaryUrl,
    protocDir,
    binary
});
