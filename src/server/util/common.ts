import * as crypto from 'crypto';

export function pbkdf2Async(password: string | Buffer,
                            salt: string | Buffer,
                            iterations: number,
                            keylength: number = 128,
                            digest: string = 'sha256'): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
        crypto.pbkdf2(password, salt, iterations, keylength, digest,
            (err: Error, derivedKey: Buffer) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(derivedKey);
        });
    });
}

export async function hashPassword(
    password: string): Promise<{ salt: string, hash: string }> {
    const salt = crypto.randomBytes(32);
    const hash = await pbkdf2Async(password, salt, 3000);

    return { salt: salt.toString('hex'), hash: hash.toString('hex') };
}

export function printAndThrowError(service: string,
                                   logger: any): (err: Error) => never {
    return (err) => {
        logger.error(`${service} failed with error: `, err);
        throw err;
    };
}
