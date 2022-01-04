# protoc-binary

Downloads latest Google Protocol Buffers binary wrapped as npm package.  

## Install

`npm i -D protoc-binary`

To force re-check for latest protoc binary releases, simply run `npm ci`.  
Alternatively, you can manually invoke the install script `node -e "require('protoc-binary/install')"`.  
If working in both Windows and WSL, you can invoke the install script to download binaries for both,
however when switching OS you should run `npm ci`.  

## Usage

|                  |                                                  |
| ---              | ---                                              |
| Node.js          | `require("protoc-binary").protoc(["--version"])` |
| npx              | `npx protoc --version`                           |
| Linux/Powershell | `node_modules/.bin/protoc --version`             |
| Windows cmd      | `node_modules\\.bin\\protoc --version`           |
|                  |                                                  |

## API

### `protoc`

```js
/* Function wrapper for protoc binary */
require("protoc-binary").protoc(
    args,    /* {string[]} protoc arguments */
    protoDir /* {string} [optional] absolute path to dir containing .proto files */
);
```

### `binary`

```js
/* Returns the absolute path to local protoc binary */
require("protoc-binary").binary;
```

### `version`

```js
/* Returns version of local protoc binary version */
require("protoc-binary").version;
```

## Supported versions

See official [protoc binaries](https://api.github.com/repos/protocolbuffers/protobuf/releases/latest) download page.

* osx-x86_64.zip
* linux-x86_32.zip
* linux-x86_64.zip
* win32.zip
* win64.zip
