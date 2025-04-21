const mysql = require("mysql2");
const express = require("express");
const db_connection = express();
db_connection.use(express.json());
const con =  mysql.createConnection({
    host: "cs6348-project.crsmosm2myjt.us-east-2.rds.amazonaws.com",
    user: "admin",
    password: "AqpZo1I0QOpmcgjJ8FiU",
    database: "CS6348_Proj",
});

db_connection.post("/approveAccess", async (req, res) => {
    const { username, tableID } = req.body;
    console.log(username,tableID);

    try {
        // Insert into AccessTables
        await new Promise((resolve, reject) => {
            con.query(
                'INSERT INTO AccessTables (username, expirationTime, tableID) VALUES (?, NOW(), ?)',
                [username, tableID],
                (err, results) => {
                    if (err) return reject(err);
                    resolve(results);
                }
            );
        });

        // Delete from Requests
        await new Promise((resolve, reject) => {
            con.query(
                'DELETE FROM Requests WHERE username = ? AND page = ?',
                [username, tableID],
                (err, results) => {
                    if (err) return reject(err);
                    resolve(results);
                }
            );
        });

        res.json({ success: true });
        console.log("Approved Access for userID:", username);
    } catch (error) {
        console.error("Error approving request", error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
});


db_connection.post("/rejectAccess", async (req, res) => {
    const { username, tableID } = req.body;

    try {
        await new Promise((resolve, reject) => {
            con.query(
                'DELETE FROM Requests WHERE username = ? AND page = ?',
                [username, tableID], // 'page' is the correct column name in Requests table
                (err, results) => {
                    if (err) return reject(err);
                    resolve(results);
                }
            );
        });

        res.json({ success: true });
        console.log("Rejected access request for userID:", username);
    } catch (error) {
        console.error("Error rejecting request", error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
});

module.exports = db_connection;