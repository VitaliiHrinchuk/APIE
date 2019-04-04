const mysql = require('mysql');

let db = mysql.createConnection({
    host: "remotemysql.com",
    user: "bbhdKgtN9L",
    password: "IyDf6wVH0E",
    database: "bbhdKgtN9L"
});
// let db = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: "apie"
// });

db.connect((err) => {
    if(err) throw err;
    console.log('connected to DB');
});

module.exports = db;