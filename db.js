const Pool = require("pg").Pool;

const pool = new Pool({
    user: "ujzuotsp",
    password: "Oei5WOt2RLnoUBOt3RXHlYU3VYyydjws",
    database: "ujzuotsp",
    host: "hattie.db.elephantsql.com",
    port: 5432,
});

module.exports = pool;
