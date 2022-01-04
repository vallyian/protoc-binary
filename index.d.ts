declare module "protoc-binary" {
    /** Absolute path to local protoc binary */
    export const binary: string;

    /** Version of local protoc binary */
    export const version: string | "";

    /**
     * Function wrapper for protoc binary
     * @param {string[]} args protoc arguments
     * @param {string} protoDir [optional] absolute path to dir containing .proto files
     * @returns void
     */
    export function protoc(args: string[], protoDir?: string): void;
}
