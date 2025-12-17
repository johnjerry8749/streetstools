import pkg from 'pg'
const { Pool } = pkg;
import fs from 'fs';
import path from 'path';

//Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

const useSsl = process.env.DB_SSL === 'true' || false;
const rejectUnauthorized = process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false';

const readCert = (envVar) => {
    const value = process.env[envVar];
    if (!value) return undefined;
    // If it looks like a file path, read it; otherwise assume it's a literal certificate string
    if (fs.existsSync(value)) return fs.readFileSync(path.resolve(value)).toString();
    return value;
};

let sslConfig = false;
if (useSsl) {
    const ca = readCert('DB_SSL_CA');
    const cert = readCert('DB_SSL_CERT');
    const key = readCert('DB_SSL_KEY');
    sslConfig = { rejectUnauthorized };
    if (ca) sslConfig.ca = ca;
    if (cert) sslConfig.cert = cert;
    if (key) sslConfig.key = key;
}

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    ssl: sslConfig,
});

pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error acquiring client', err.stack)
    }else{
        console.log('Excellent Your Database connected successfully');
        console.log('DB SSL used:', useSsl, 'rejectUnauthorized:', rejectUnauthorized);
        release();
    }
});

export default pool;
    