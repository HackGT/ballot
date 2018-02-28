const dotenv = require('dotenv');
dotenv.config();

const pg = require('pg');
const fs = require('fs');
const path = require('path');

if (process.env.USERNAME === undefined)
    throw new Error('Database user process.env.USERNAME is missing');
if (process.env.POSTGRES_URL === undefined) {
    throw new Error('Database host process.env.POSTGRES_URL is missing');
}
if (process.env.DBNAME === undefined) {
    throw new Error('Database name process.env.DBNAME is missing');
}

const pool = new pg.Pool({
    user: process.env.USERNAME,
    host: process.env.POSTGRES_URL,
    database: process.env.DBNAME,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT
});

const sql = fs.readFileSync(path.resolve(__dirname, '../src/server/sql/schema.sql')).toString();

pool.query(sql, (err, res) => {
    if(err)
        console.log(err);
    console.log('Successfully created tables in database', process.env.DBNAME);
    pool.end();
});