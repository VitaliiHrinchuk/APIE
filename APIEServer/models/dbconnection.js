const mysql = require('mysql');

let db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "apie"
});

db.connect((err) => {
    if(err) throw err;
    console.log('connected to DB');
});

module.exports = db;