var mysql = require('mysql2');
const express = require('express');
const db_connection = express();
db_connection.use(express.json())
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "CS6348"
})

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

async function getUsers(request) {
    return new Promise((resolve, reject) => {
        con.connect(function (err) {
            if (err) {
                return reject(err);
            }
            console.log(request.body);
            
            con.query("SELECT * FROM user WHERE username = ?", [request.body.username], function (err, result, fields) {
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
