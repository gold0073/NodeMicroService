

// maria Connect Info
module.exports.maria_conn = {
            host: 'localhost',
            user: 'micro',
            password: 'service',
            database: 'monolithic'
    };


const { Pool } = require("pg");
module.exports.postgre_pool =new Pool({
        host: 'localhost',
        user: 'postgres',
        password: 'park0070!',
        database: 'monolithic',
        port : '5432'
    });
