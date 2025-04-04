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

    // var result;
    // result.status = "ACCEPTED";
    // res.json(result);

    // generate token and send email
    // const response = await fetch("http://localhost:8080/sendEmail", {
    //     method: "POST",
    //     headers: {
    //     "Access-Control-Allow-Origin" : "*",
    //     "Content-type": "application/json",
    //     },
    //     body: JSON.stringify({
    //         "email": // add email from getUsers,
    //     }),
    // });

    // TODO: swap order so that token is saved to database first, then email is sent
    // save token to database
    // const writeToken = await writeToken(result.email, response.token);

    // const result = await getUsers(req);
    // if(result.password == req.body.password){
    //     result.status = "ACCEPTED"
    // }
    // else {
    //     result.status = "REJECTED"
    // }
    // console.log(result);
    // res.json(result);
});

// async function writeToken(email, token) {
//     return new Promise((resolve, reject) => {
//         con.query(`INSERT INTO loginToken VALUES (${email}, ${token}, "")`, function (err, result) {
//             if (err) {
//                 return reject(err);
//             } else {
//                 resolve(result);
//             }
//         });
//     });
// }

async function getData(tableName) {
    return new Promise((resolve, reject) => {
        con.query(`SELECT * FROM ${tableName}`, function (err, result) {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });
}

db_connection.get('/getCategories', async (req, res) => {
    try {
        const result = await getData('Categories');
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get Customers
db_connection.get('/getCustomers', async (req, res) => {
    try {
        const result = await getData('Customers');
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


db_connection.get('/getOrderDetails', async (req, res) => {
    try {
        const result = await getData('OrderDetails');
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

db_connection.get('/getOrders', async (req, res) => {
    try {
        const result = await getData('Orders');
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

db_connection.get('/getPayments', async (req, res) => {
    try {
        const result = await getData('Payments');
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


db_connection.get('/getProductCategories', async (req, res) => {
    try {
        const result = await getData('ProductCategories');
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

db_connection.get('/getProducts', async (req, res) => {
    try {
        const result = await getData('Products');
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

db_connection.get('/getReviews', async (req, res) => {
    try {
        const result = await getData('Reviews');
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
