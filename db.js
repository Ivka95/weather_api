const Pool = require("pg").Pool;

const pool = new Pool({
    user: "lyvxbexw",
    password: "ELFaID5BEvScE1nnuf1V9cA3BGwKhX9a",
    database: "lyvxbexw",
    host: "lucky.db.elephantsql.com",
    port: 5432,
});

module.exports = pool;
