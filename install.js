const fs = require("fs");
const path = require("path");
const https = require("https");
const extract = require("extract-zip");
const consts = require("./consts");
const index = require("./index");

const binaryZipRx = new RegExp(`\/protoc-(.*)-${consts.binaryZip}`);

(async function install() {
    if (!consts.binaryZip)
        throw Error(`${process.platform}-${process.arch} unsupported`)

    const { version, downloadUrl } = await getVersionInfo();
    if (version === index.version) {
        console.log(`latest protoc v${index.version} already exists, skipping download`);
        return;
    }

    const zip = "protoc.zip";

    console.log(`downloading protoc v${version} from ${downloadUrl}`);
    await download(downloadUrl, zip);
    if (!fs.existsSync(zip))
        throw Error(`binary "${consts.binaryZip} not downloaded"`);

    await unzip(zip, consts.protocDir);
    if (!fs.existsSync(consts.binary))
        throw Error(`binary "${consts.binary} not unzipped"`);

    if (fs.existsSync(zip))
        fs.unlinkSync(zip);

    console.log(`downloaded protoc v${index.version}`);
})();

async function unzip(zip, dir) {
    let fileCount = 0;
    let totalSize = 0;

    await extract(zip, {
        dir,
        onEntry: entry => {
            fileCount++;
            if (fileCount > consts.safeUnzip.MAX_FILES)
                throw Error('Reached max. number of files');

            let entrySize = entry.uncompressedSize;
            totalSize += entrySize;
            if (totalSize > consts.safeUnzip.MAX_SIZE)
                throw Error('Reached max. size');

            if (entry.compressedSize > 0) {
                let compressionRatio = entrySize / entry.compressedSize;
                if (compressionRatio > consts.safeUnzip.THRESHOLD_RATIO)
                    throw Error('Reached max. compression ratio');
            }
        }
    });
}

async function getVersionInfo() {
    let version = getRequestedVersion();
    let downloadUrl = "";

    if (version) {
        downloadUrl = consts.downloadUrlTemplate.replace(/\{version\}/g, version);
    } else {
        process.stdout.write(`querying latest protoc version...`);
        downloadUrl = await getLatestReleaseLink().catch(e => {
            process.stdout.write('\n');
            throw e;
        });
        version = downloadUrl.match(binaryZipRx)[1];
        process.stdout.write(`v${version} found\n`);
    }

    return { version, downloadUrl };
}

function getRequestedVersion() {
    let dir = process.cwd();
    let requestedVersion = undefined;
    while (!requestedVersion) {
        const packageJsonPath = path.join(dir, "package.json");
        if (fs.existsSync(packageJsonPath))
            requestedVersion = require(packageJsonPath)["protoc-binary"];
        if (requestedVersion || !dir.includes("node_modules"))
            break;
        dir = path.normalize(path.join(dir, ".."));
    }
    return requestedVersion || "";
}

function getLatestReleaseLink() {
    return new Promise((resolve, reject) => https.get(consts.latestReleaseUrl, { headers: { "User-Agent": `Nodejs/${process.version}` } }, response => {
        let data = "";
        response.on("data", chunk => data += chunk);
        response.on("end", () => {
            const link = JSON.parse(data).assets.find(a => binaryZipRx.test(a.browser_download_url));
            link
                ? resolve(link.browser_download_url)
                : reject(`binary ${consts.binaryZip} not available`);
        });
    }).on("error", reject));
}

function download(uri, filename) {
    return new Promise((resolve, reject) => https.get(uri, response => {
        if (response.statusCode === 200)
            response.pipe(
                fs.createWriteStream(filename)
                    .on("error", reject)
                    .on("close", resolve)
            );

        else if (response.headers.location)
            resolve(download(response.headers.location, filename));

        else
            reject(Error(`${response.statusCode} ${response.statusMessage}`));

    }).on("error", reject));
}
