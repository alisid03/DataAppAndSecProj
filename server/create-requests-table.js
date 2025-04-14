const mysql = require('mysql2');

const con = mysql.createConnection({
    host: "cs6348-project.crsmosm2myjt.us-east-2.rds.amazonaws.com",
    user: "admin",
    password: "AqpZo1I0QOpmcgjJ8FiU",
    database: "CS6348_Proj"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");

    const sql = "CREATE TABLE IF NOT EXISTS requests (username VARCHAR(255), feature VARCHAR(255))";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Table created or already exists");
        con.end();
    });
});
