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
        
        if (result && result.password == req.body.password) {
            result.status = "ACCEPTED";
        } else {
            result.status = "REJECTED";
        }

        console.log(result);
        res.json(result);
    } catch (error) {
        console.error("Request Access error:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

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
        // Sanitize input: Trim whitespace
        const username = request.body.username ? request.body.username.trim() : null;
        const password = request.body.password; // Password check happens later, no trim needed here

        if (!username) {
            return reject(new Error("Username is required"));
        }

        console.log("Sanitized username for getUser:", username);

        con.query("SELECT * FROM user WHERE username = ?", [username], function (err, result, fields) {
            if (err) {
                console.error("Database error in getUsers:", err);
                return reject(err);
            }
            console.log(result);
            if (result.length > 0) {
                const user = result[0];
                if (user) {
                    try {
                        
                            user.accessTables = JSON.parse(user.accessTables);
                
                    } catch (e) {
                        console.error("Error parsing accessTables:", e);
                        user.accessTables = [];
                    }
                    resolve(user);
                } else {
                    resolve(null);
                }
            } else {
                 resolve(null); // Resolve with null if result array is empty
            }
        });
    });
}

// New user creation endpoint
db_connection.post('/createUser', async (req, res) => {
    try {
        // Basic validation
        if (!req.body.username || !req.body.password) {
             return res.status(400).json({ error: 'Username and password are required' });
        }
        // Sanitize input: Trim whitespace
        const username = req.body.username.trim();
        const password = req.body.password; // Typically store password as-is (hashing should happen ideally)

        if (!username) { // Check after trimming
             return res.status(400).json({ error: 'Username cannot be empty' });
        }

        const result = await createUser(username, password);
        res.json({ status: "ACCEPTED" });
    } catch (error) {
        console.error("CreateUser error:", error);
        // Avoid sending detailed SQL errors to client
        res.status(500).json({ error: 'Failed to create user' });
    }
});

async function createUser(sanitizedUsername, password) { // Parameter name updated for clarity
    // Ideally, hash the password here before storing
    // const hashedPassword = await bcrypt.hash(password, 10); // Example using bcrypt
    return new Promise((resolve, reject) => {
        // Using sanitizedUsername
        con.query("INSERT INTO user (username, password) VALUES (?, ?)", [sanitizedUsername, password /* hashedPassword */], function (err, result, fields) {
            if (err) {
                 console.error("Database error in createUser:", err);
                // Check for duplicate entry error (ER_DUP_ENTRY)
                 if (err.code === 'ER_DUP_ENTRY') {
                     return reject(new Error('Username already exists'));
                 }
                return reject(err);
            }

            resolve({ status: "ACCEPTED" });
        });
    });
}

db_connection.post('/requestAccess', async (req, res) => {
    try {
         // Basic validation
        if (!req.body.username || !req.body.feature) {
             return res.status(400).json({ error: 'Username and feature are required' });
        }
         // Sanitize input: Trim whitespace
        const username = req.body.username.trim();
        const feature = req.body.feature.trim();

        if (!username || !feature) { // Check after trimming
             return res.status(400).json({ error: 'Username and feature cannot be empty' });
        }

        const result = await requestAccess(username, feature);
        res.json({ status: "ACCEPTED" });
    } catch (error) {
        console.error("RequestAccess endpoint error:", error);
        res.status(500).json({ error: 'Failed to submit request' });
    }
});

async function requestAccess(sanitizedUsername, sanitizedFeature) { // Parameter names updated
    return new Promise((resolve, reject) => {
        // Use MySQL's NOW() function to insert the current timestamp directly
        // Using sanitized inputs
        con.query("INSERT INTO requests (username, page, request_time) VALUES (?, ?, NOW())", [sanitizedUsername, sanitizedFeature], function (err, result, fields) {
            if (err) {
                console.error("Database error in requestAccess:", err);
                return reject(err);
            }
            // Also, send an alert to the admin (not implemented here)
            //console.log(`Request for ${featureName} from ${username}`);

            resolve({ status: "ACCEPTED" });
        });
    });
}

db_connection.get('/allowedFeatures/:username', async (req, res) => {
    try {
        // Sanitize input: Trim whitespace (though less critical for GET params unless used in complex ways)
        const username = req.params.username ? req.params.username.trim() : null;
        if (!username) {
             return res.status(400).json({ error: 'Username parameter is required' });
        }
        const result = await getAllowedFeatures(username);
        res.json(result);
    } catch (error) {
        console.error("AllowedFeatures endpoint error:", error);
        res.status(500).json({ error: 'Failed to get allowed features' });
    }
});

async function getAllowedFeatures(sanitizedUsername) { // Parameter name updated
    return new Promise((resolve, reject) => {
         // Using sanitized input
        con.query("SELECT accessTables FROM user WHERE username = ?", [sanitizedUsername], function (err, result, fields) {
            if (err) {
                 console.error("Database error in getAllowedFeatures:", err);
                return reject(err);
            }

            if (result.length > 0) {
                const user = result[0];
                const features = JSON.parse(user.accessTables);
                resolve(features);
            } else {
                resolve([]);
            }
        });
    });
}

// Endpoint to verify if a user exists in the database
db_connection.get('/verifyUser/:username', async (req, res) => {
    try {
        const username = req.params.username ? req.params.username.trim() : null;
        if (!username) {
            return res.status(400).json({ error: 'Username parameter is required' });
        }

        const exists = await checkUserExists(username);
        res.json({ exists: exists });

    } catch (error) {
        console.error("VerifyUser endpoint error:", error);
        res.status(500).json({ error: 'Failed to verify user' });
    }
});

async function checkUserExists(sanitizedUsername) {
    return new Promise((resolve, reject) => {
        // Query just to check existence, selecting a minimal column like 'username' or '1'
        con.query("SELECT 1 FROM user WHERE username = ? LIMIT 1", [sanitizedUsername], function (err, result, fields) {
            if (err) {
                console.error("Database error in checkUserExists:", err);
                return reject(err);
            }
            // If result has length > 0, the user exists
            resolve(result.length > 0);
        });
    });
}


module.exports = db_connection;
