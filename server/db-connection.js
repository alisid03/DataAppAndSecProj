var mysql = require('mysql2');
const express = require('express');
const db_connection = express();
db_connection.use(express.json())
var con = mysql.createConnection({
    host: "cs6348-project.crsmosm2myjt.us-east-2.rds.amazonaws.com",
    user: "admin",
    password: "AqpZo1I0QOpmcgjJ8FiU",
    database: "CS6348_Proj"
})

con.connect((err) => {
    if (err) {
        console.error("MySQL connection error:", err);
        process.exit(1); // exit the app if connection fails
    }
    console.log("MySQL connected successfully.");
});

db_connection.post('/getUser', async (req, res) => {
    try {
        const result = await getUsers(req);
        if(result.password == req.body.password){
            result.status = "ACCEPTED"
        }
        else {
            result.status = "REJECTED"
        }
        console.log(result);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

db_connection.post('/requestAccess', async (req, res) => {
    try {
        const result = await requestAccess(req);
        console.log(result);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

db_connection.get('/getPendingRequests', async (req, res) => {
    try {
        const result = await getRequests(req);
        console.log(result);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

async function getUsers(request) {
    return new Promise((resolve, reject) => {
        console.log(request.body);
        con.query("SELECT * FROM user WHERE username = ?", [request.body.username], function (err, result, fields) {
            if (err) {
                return reject(err);
            }
            console.log(result);
            resolve(result[0]); // Resolve the promise with the result
            }
        );
    });
}

async function getRequests(request) {
    return new Promise((resolve, reject) => {
        console.log(request.body);
        con.query("SELECT * FROM requests", function (err, rows) {
            if (err) {
                return reject(err);
            }
            console.log(rows);
            resolve(rows); // Resolve the promise with the result
        });
    });
}





async function requestAccess(request) {
    return new Promise((resolve, reject) => {
        con.connect(function (err) {
            if (err) {
                return reject(err);
            }
            console.log(request.body);

            // if its an array of access numbers, need to add all of them
            con.query("INSERT INTO requests (username, page, request_time) VALUES (?,?,NOW()) ", [request.body.username, request.body.page], function (err, result, fields) {
                if (err) {
                    return reject(err);
                }
                console.log(result);
                resolve(result[0]); // Resolve the promise with the result
            });
        });
    });
}



module.exports = db_connection;
