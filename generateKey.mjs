import { generateKeyPairSync, randomBytes } from 'crypto';
import { Buffer } from 'buffer';
import { config } from 'dotenv';

config();

const genKeyPair = () => {
    const { publicKey, privateKey, } = generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
            cipher: 'aes-256-cbc',
            passphrase: process.env.REFRESH_TOKEN_SECRET
        }
    });

    const privateKey_base64 = Buffer.from(privateKey).toString('base64');
    const publicKey_base64 = Buffer.from(publicKey).toString('base64')

    console.log(privateKey_base64);
    console.log('================BEGIN PUBLIC KEY=====================');
    console.log(publicKey_base64);
}

// const KEY = fs.readFileSync(new URL('PATH-TO-KEY', import.meta.url)).toString('base64');
// console.log(KEY)

const genSecret = () => {
    randomBytes(256, (err, buf) => {
        if (err) throw err;
        console.log(`${buf.length} bytes of random data: ${buf.toString('hex')}`);
    })
}

genKeyPair()
