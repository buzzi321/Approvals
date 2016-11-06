var mysql = require('mysql');

var DB = mysql.createConnection({
    host: 'localhost',
    user: 'sekhar',
    password: 'sekhar',
    database: 'mydb'
});

DB.connect(function (err) {
    if (!err) {
        console.log("Database is connected ... \n\n");
    } else {
        console.log("Error connecting database ... \n\n");
    }
});

module.exports.DB = DB;