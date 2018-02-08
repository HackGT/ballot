import * as crypto from "crypto";

export function pbkdf2Async(password: string | Buffer, salt: string | Buffer, iterations: number, keylength: number = 128, digest: string = "sha256") {
    return new Promise<Buffer>((resolve, reject) => {
        crypto.pbkdf2(password, salt, iterations, keylength, digest, (err: Error, derivedKey: Buffer) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(derivedKey);
        });
    });
}