const fs = require("fs");
const https = require("https");
const unzip = require("extract-zip");
const consts = require("./consts");
const index = require("./index");

const binaryZipRx = new RegExp(`\/protoc-(.*)-${consts.binaryZip}`);

(async function install() {
  if (!consts.binaryZip)
    throw Error(`${process.platform}-${process.arch} unsupported`)

  process.stdout.write(`querying latest protoc version...`);
  const latestReleaseLink = await getLatestReleaseLink().catch(e => { 
    process.stdout.write('\n');
    throw e;
  });
  const latestReleaseVersion = latestReleaseLink.match(binaryZipRx)[1];
  process.stdout.write(`v${latestReleaseVersion} found\n`);

  if (latestReleaseVersion === index.version) {
    console.log(`latest protoc v${index.version} already exists, skipping download`);
    return;
  }
  
  const zip = "protoc.zip";

  console.log(`downloading latest protoc v${latestReleaseVersion} from ${latestReleaseLink}`);
  await download(latestReleaseLink, zip);
  if (!fs.existsSync(zip))
    throw Error(`binary "${consts.binaryZip} not downloaded"`);

  await unzip(zip, { dir: consts.protocDir });
  if (!fs.existsSync(consts.binary))
    throw Error(`binary "${consts.binary} not unzipped"`);
  
  if (fs.existsSync(zip))
    fs.unlinkSync(zip);
  
  console.log(`downloaded protoc v${index.version}`);
})();

function getLatestReleaseLink() {
  return new Promise((resolve, reject) => https.get(consts.binaryUrl, { headers: { "User-Agent": `Nodejs/${process.version}` } }, response => {
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
};
