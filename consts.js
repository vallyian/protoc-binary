const path = require("path");

const binaryZip = {
    "darwin-arm64": "osx-aarch_64.zip",
    "darwin-x64": "osx-x86_64.zip",
    "linux-x32": "linux-x86_32.zip",
    "linux-x64": "linux-x86_64.zip",
    "linux-arm64": "linux-aarch_64.zip",
    "win32-x32": "win32.zip",
    "win32-x64": "win64.zip"
}[process.platform + "-" + process.arch];

const latestReleaseUrl = "https://api.github.com/repos/protocolbuffers/protobuf/releases/latest"
const downloadUrlTemplate = `https://github.com/protocolbuffers/protobuf/releases/download/v{version}/protoc-{version}-${binaryZip}`

const protocDir = path.join(__dirname, "./protoc");
const binary = path.join(protocDir, "bin", `protoc${process.platform === "win32" ? ".exe" : ""}`);

const safeUnzip = Object.freeze({
    MAX_FILES: 1_000,
    MAX_SIZE: 20_000_000, // 20 MB
    THRESHOLD_RATIO: 10
});

module.exports = Object.freeze({
    binaryZip,
    latestReleaseUrl,
    downloadUrlTemplate,
    protocDir,
    binary,
    safeUnzip
});
