import { Pool } from 'pg';


// const isProduction = process.env.NODE_ENV === 'production';

// const pool = new Pool({
//     host: isProduction ? config.pgsql_hostname_prod : config.pgsql_hostname_dev, // Can override by env var: PGHOST
//     database: config.pgsql_database, // Can override by env var: PGDATABASE
//     user: config.pgsql_username, // Can override by env var: PGUSER
//     password: config.pgsql_password, // Can override by env var: PGPASSWORD
//     port: config.pgsql_port, // Can override by env var: PGPORT
// });

const pool = new Pool();

// Initializes a connection pool
export default {
    query: (text: string, params: any[]) => pool.query(text, params),
    pool,
};