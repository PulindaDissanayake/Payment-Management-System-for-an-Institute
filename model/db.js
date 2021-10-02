var mysql = require("mysql");

var mysqlConnection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "my",
    port : '3306',
    multipleStatements: true,
    timezone: 'utc'
});

mysqlConnection.connect(function(err) {
    if (!err) {
        console.log("Database Connected");

    } else {
        console.log("Database connection failed");
        console.log(err.message);
    }
});
module.exports = mysqlConnection;