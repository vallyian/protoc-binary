# protoc-binary

Downloads latest Google Protocol Buffers binary wrapped as npm package.

## Install

`npm i -D protoc-binary`

## Usage

|                  |                                                  |
| ---              | ---                                              |
| Node.js          | `require("protoc-binary").protoc(["--version"])` |
| npx              | `npx protoc --version`                           |
| Linux/Powershell | `node_modules/.bin/protoc --version`             |
| Windows cmd      | `node_modules\\.bin\\protoc --version`           |
|                  |                                                  |

## Supported versions

See official [protoc binaries](https://api.github.com/repos/protocolbuffers/protobuf/releases/latest) download page.

* osx-x86_64.zip
* linux-x86_32.zip
* linux-x86_64.zip
* win32.zip
* win64.zip
