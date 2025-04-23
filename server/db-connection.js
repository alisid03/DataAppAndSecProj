var mysql = require("mysql2");
const express = require("express");
const uuid4 = require('uuid4');
const db_connection = express();
const crypto = require("crypto");
const cors = require("cors");



// ── MIDDLEWARE ──
db_connection.use(cors({ origin: "*" })); // or '*' for dev
db_connection.use(express.json())
var con = mysql.createConnection({
    host: "cs6348-project.crsmosm2myjt.us-east-2.rds.amazonaws.com",
    user: "admin",
    password: "AqpZo1I0QOpmcgjJ8FiU",
    database: "CS6348_Proj",
});

const ALLOWED_TABLE_NAMES = [
  "Categories",
  "Customers",
  "OrderDetails",
  "Orders",
  "Payments",
  "ProductCategories",
  "Products",
  "Reviews",
  "AccessTables",
  "LogTable",
  "LoginToken",
  "TableIDs",
];

const serverPrivateKey =`
-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDrJ0h55bmr3zLo
S6ysBVFHjfX5nWct8ij65DZMON7F1k/w/o8u2n33PoTPBXsxFJ25ICuVLvqwcGI1
9m/oDwduejBZrij8jbLUu+5T9HqUn/HDHU6F8DWSDQSjK6qhLF+26UwIycPFmZqQ
cxDVVSK/fm+DvmoRHImBLjWnUbFRJpIxXob/EUmg/3xhYgGtaslwjQX88a4PM4gw
Jb8tJdtexpBf6zoyb8T2LHpZ7+gJNQ5FtPWdkibQ1nIXeNd8ImCT2m6/AkroIjSu
G51pfjBQEK4k7dXiag/fqt6jniUb/bEFQldYST+Gbi4X3DhXWhvNQmdG25MdOGkl
X5Iw/ErbAgMBAAECggEAbFp/hNubwFxqYqtr9x/EIgqByvECeCNbSrAZbOnPjK2B
zHQfmeFHpcODArlt2GG9g24VZvpsvRwrxN23FuDF9dwLp2cer7DDNE8cNEc0rIM+
rT81zXWv2YpyFpWqW/XMbMX3KR1/Pe/XTrQWj5ZZGo+x5qy4xwW1PncCdgSohdEz
xK3uZ/6+5buPUyagvbjXE259TLmv47jlZFRAWqa3uxG2/2p6z1IHfQgwyx5eHlAE
+ujTkU/97HP/2S8Ihz4huuTo9K9h/Dmr7gH3TBDhAee9zgAyx61z2D1FynRcH4aE
MD6wEGsn6CMps7MEhu9/lS7xNsTToXRT5qjqQe4ocQKBgQD/YkPmWBRJlOHEHM6p
Et5ocTffiC1khPJn6z3eOpAayYEbjAD12+jo49xqR585GsT3MUx2FURVNlOQGZfG
L4dNfKbctSpd/2b0XpBNP47Iu/zecuKFkTmzMSq3eKS813grrSVk7M4LiCKRysTS
UZpRK+nbKzQTaAakszblP45G/QKBgQDruIXXHJOnFOUQoU00hWAabepP4h3apNmK
Od8KGypkNyBO0pSCARFShoX/U3q81BsebiJriqXArc5ylsC4Zy9rp1QXShUKqwTe
E9jrxj1af+ltRndXxz4zgEoVgNlOmV/vQRBqLc5yv7kjwyzcgLR2Gt+Jq0LEZ/c+
tx+7jQl8twKBgQD7P9XFXIo5CfxDUIQQ2rtszVZG2FawOguyKUGozLzRXcVjMI4R
U9UEqohDF0uShr+Y4itzUOD1ZIk5j7Q+Cqx2k1gmcyXHbGoBqLcXCJyU6D2TLDun
ZIT7wjdgYZTRJLrZXXMYo9Dij4BTJsYUlKvZh/Z+5TZKkWFXz+kGCU0UkQKBgACL
9QOCtXT1v3JCbYNpq8dj6d81jwwqxbZkW/gSCA8jcZe9NUr35apjVXw6HVbCxy1S
5BGLyMahoJDzeI707k85nCBRs6rKqsA5G4+wbgP/t/Lg7vXtKF/GNGXIXrin8mkD
pZ4ZbRknCK7kjP4V7lU3yrzvAMCj3RbwJcqxkQwRAoGBAIw2fjIImU+8eLcpPEYu
KcZTYKgDGBLUlGl+BEqbCusJr5my6VhMclS7hx6UHCgU2vaVet9Wu7ze+knVRhHi
CCUXau31F8S8lUiuO9VC8tNcq2n71mFCV5+McSPqab7BU6Ug/XHscMD5yMBrJ7xB
oY1fRpUw1yIHjXWaOjX7hITJ
-----END PRIVATE KEY-----
`;



//getData function with Whitelisting
async function getData(tableName) {
  return new Promise((resolve, reject) => {
    if (!ALLOWED_TABLE_NAMES.includes(tableName)) {
      console.error(`Attempt to query disallowed table: ${tableName}`);

      return reject(new Error("Invalid table name specified."));
    }

    con.query('SELECT * FROM ??', [tableName], function (err, result) {
      if (err) {
        console.error(`Error querying table ${tableName}:`, err);
        return reject(err);
      }
      resolve(result);
    });
  });
}

db_connection.get("/getCategories", async (req, res) => {
  try {
    const result = await getData("Categories");
    res.json(result);
  } catch (error) {
    console.error("Error in /getCategories:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

db_connection.get("/getCustomers", async (req, res) => {
  try {
    const result = await getData("Customers");
    res.json(result);
  } catch (error) {
    console.error("Error in /getCustomers:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

db_connection.get("/getOrderDetails", async (req, res) => {
  try {
    const result = await getData("OrderDetails");
    res.json(result);
  } catch (error) {
    console.error("Error in /getOrderDetails:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

db_connection.get("/getOrders", async (req, res) => {
  try {
    const result = await getData("Orders");
    res.json(result);
  } catch (error) {
    console.error("Error in /getOrders:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

db_connection.get("/getPayments", async (req, res) => {
  try {
    const result = await getData("Payments");
    res.json(result);
  } catch (error) {
    console.error("Error in /getPayments:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

db_connection.get("/getProductCategories", async (req, res) => {
  try {
    const result = await getData("ProductCategories");
    res.json(result);
  } catch (error) {
    console.error("Error in /getProductCategories:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

db_connection.get("/getProducts", async (req, res) => {
  try {
    const result = await getData("Products");
    res.json(result);
  } catch (error) {
    console.error("Error in /getProducts:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

db_connection.get("/getReviews", async (req, res) => {
  try {
    const result = await getData("Reviews");
    res.json(result);
  } catch (error) {
    console.error("Error in /getReviews:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

db_connection.get("/getAccessTables", async (req, res) => {
  try {
    const result = await getData("AccessTables");
    res.json(result);
  } catch (error) {
    console.error("Error in /getAccessTables:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

db_connection.get("/getLogTable", async (req, res) => {
  try {
    const result = await getData("LogTable");
    res.json(result);
  } catch (error) {
    console.error("Error in /getLogTable:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

db_connection.get("/getLoginToken", async (req, res) => {
  try {
    const result = await getData("LoginToken");
    res.json(result);
  } catch (error) {
    console.error("Error in /getLoginToken:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

db_connection.get("/getTableIDs", async (req, res) => {
  try {
    const result = await getData("TableIDs");
    res.json(result);
  } catch (error) {
    console.error("Error in /getTableIDs:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

function decryptPayload(base64Encrypted) {
  const buffer = Buffer.from(base64Encrypted, 'base64');

  return crypto.privateDecrypt(
    {
      key: serverPrivateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256',
    },
    buffer
  ).toString('utf8');
}

db_connection.post("/getUser", async (req, res) => {
  try {
    const decrypted = decryptPayload(req.body.encrypted);

    const { username, password } = JSON.parse(decrypted);
    const signature = req.body.signature;
  

    console.log("Incoming /getUser body:", req.body);

    req.body.username = username;
    req.body.password = password;

    const verifier = crypto.createVerify("SHA256");
    const payloadStr = JSON.stringify({ username, password });
    verifier.update(payloadStr);
    verifier.end();

    const sigBuffer = Buffer.from(signature, "base64");
    const clientPub = req.body.clientPublicKey;
    if (!clientPub) {
      return res.status(400).json({ status: "REJECTED", error: "Client public key not registered" });
    }

    const valid = verifier.verify(
      { key: clientPub, padding: crypto.constants.RSA_PKCS1_PADDING },
      sigBuffer
    );
    if (!valid) {
      return res.status(400).json({ status: "REJECTED", error: "Invalid signature" });
    }
    
    const userResult = await getUsers(req);
    let responseData = { status: "REJECTED" };

    if (userResult && userResult.password == req.body.password) {
      const sessionToken = await getSessionToken();

      // get auth and session tokens and send email to user
      const response = await fetch("http://localhost:8080/sendEmail", {
          method: "POST",
          headers: {
            "Access-Control-Allow-Origin" : "*",
            "Content-type": "application/json",
          },
          body: JSON.stringify({
              "email": userResult.email
          }),
      });
      const resJson = await response.json();

      await writeToken(userResult.email, resJson.authToken, sessionToken);

      responseData = { username: userResult.username, sessionToken: sessionToken, status: "ACCEPTED" }; 

    } else if (userResult) {
      responseData.error = "Incorrect password";
    } else {
      responseData.error = "User not found";
    }

    console.log("getUser response:", responseData);
    res.json(responseData);
  } catch (error) {
    console.error("Request Access error:", error);

    res.status(500).json({
      status: "REJECTED",
      error: error.message || "Internal Server Error",
    });
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

async function getRequests(request) {
    return new Promise((resolve, reject) => {
        console.log(request.body);
        con.query("SELECT * FROM Requests", function (err, rows) {
            if (err) {
                return reject(err);
            }
            console.log(rows);
            resolve(rows); // Resolve the promise with the result
        });
    });
}

async function getUsers(request) {
  return new Promise((resolve, reject) => {
    const username = request.body.username
      ? request.body.username.trim()
      : null;

    if (!username) {
      return reject(new Error("Username is required"));
    }

    console.log("Sanitized username for getUser:", username);

    con.query(
      "SELECT * FROM User WHERE username = ?",
      [username],
      function (err, result, fields) {
        if (err) {
          console.error("Database error in getUsers:", err);
          return reject(err);
        }

        if (result.length > 0) {
          // User found, resolve with the user data (all columns fetched by SELECT *)

          const user = { ...result[0] };
          console.log(`User ${username} found.`);
          resolve(user);
        } else {
          // User not found
          console.log(`User ${username} not found in database.`);
          resolve(null);
        }
      }
    );
  });
}

db_connection.post("/createUser", async (req, res) => {
  try {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const userBadRegex = new RegExp("[^a-zA-Z0-9]");
    const emailBadRegex = new RegExp("[^a-zA-Z0-9@.]");

    if (username != encodeURIComponent(username).replace(userBadRegex, "")) {
      return res.status(400).json({ error: "Username cannot contain any special characters." });
    }
    if (email != encodeURIComponent(email).replace("%40", "@").replace(emailBadRegex, "")) {
      return res.status(400).json({ error: "Email cannot contain any special characters." });
    }

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ error: "Username, email, and password are required" });
    }

    const result = await createUser(username, password, email);
    res.json({ status: "ACCEPTED", message: "User created" });
  } catch (error) {
    console.error("CreateUser error:", error);
    if (error.message === "Username already exists") {
      res.status(409).json({ error: "Username already exists" });
    } else {
      res.status(500).json({ error: "Failed to create user" });
    }
  }
});

async function createUser(sanitizedUsername, password, email) {
  return new Promise((resolve, reject) => {
    con.query(
      "INSERT INTO User (username, password, email) VALUES (?, ?, ?)",
      [sanitizedUsername, password, email],
      function (err, result, fields) {
        if (err) {
          console.error("Database error in createUser:", err);
          if (err.code === "ER_DUP_ENTRY") {
            return reject(new Error("Username already exists"));
          }
          return reject(err);
        }

        resolve(result);
      }
    );
  });
}

db_connection.post("/requestAccess", async (req, res) => {
  try {
    if (!req.body.username || !req.body.feature) {
      return res
        .status(400)
        .json({ error: "Username and feature are required" });
    }
    const username = req.body.username.trim();
    const feature = req.body.feature.trim();

    if (!username || !feature) {
      return res
        .status(400)
        .json({ error: "Username and feature cannot be empty" });
    }

    const result = await requestAccess(username, feature);
    res.json({ status: "ACCEPTED", message: "Access request submitted" });
  } catch (error) {
    console.error("RequestAccess endpoint error:", error);
    res.status(500).json({ error: "Failed to submit request" });
  }
});

async function requestAccess(sanitizedUsername, featureName) {
  // Handles submitting an access request for a feature (table)
  return new Promise((resolve, reject) => {
    // Step 1: Find the numeric tableID corresponding to the featureName
    con.query(
      "SELECT tableID FROM TableIDs WHERE tableName = ?",
      [featureName],
      function (idErr, idResults) {
        if (idErr) {
          console.error(
            "Database error looking up tableID in requestAccess:",
            idErr
          );
          // Provide a more generic error to the client
          return reject(new Error("Database error processing request."));
        }
        if (idResults.length === 0) {
          // The requested feature name doesn't exist in TableIDs
          console.error(
            `Feature name "${featureName}" not found in TableIDs during request.`
          );
          return reject(new Error(`Invalid feature specified: ${featureName}`));
        }

        const tableId = idResults[0].tableID; // Get the numeric ID

        // Step 2: Insert the request using the numeric tableID in the 'page' column
        con.query(
          "INSERT INTO Requests (username, page, request_time) VALUES (?, ?, NOW())", // Corrected table name capitalization
          [sanitizedUsername, tableId], // Use the numeric tableId
          function (insertErr, insertResult) {
            if (insertErr) {
              console.error(
                "Database error inserting access request:",
                insertErr
              );
              // Handle potential duplicate entry errors specifically if needed
              if (insertErr.code === "ER_DUP_ENTRY") {
                return reject(
                  new Error(
                    "You have already requested access for this feature."
                  )
                );
              }
              // Generic error for other insertion issues
              return reject(new Error("Database error submitting request."));
            }
            // Success
            console.log(
              `Access request submitted for user ${sanitizedUsername}, feature ID ${tableId} (${featureName})`
            );
            resolve(insertResult);
          }
        );
      }
    );
  });
}

db_connection.get("/allowedFeatures/:username", async (req, res) => {
  try {
    const username = req.params.username ? req.params.username.trim() : null;
    if (!username) {
      return res.status(400).json({ error: "Username parameter is required" });
    }
    const result = await getAllowedFeatures(username);
    res.json(result);
  } catch (error) {
    console.error("AllowedFeatures endpoint error:", error);
    res.status(500).json({ error: "Failed to get allowed features" });
  }
});

async function getAllowedFeatures(sanitizedUsername) {
  // Fetches the names of tables a user has access to based on AccessTables and TableIDs
  return new Promise((resolve, reject) => {
    const query = `
      SELECT ti.tableName 
      FROM AccessTables at
      JOIN TableIDs ti ON at.tableID = ti.tableID
      WHERE at.username = ? 
      -- Optional: Add check for expirationTime > NOW() if needed
      -- AND at.expirationTime > NOW() 
    `;

    con.query(query, [sanitizedUsername], function (err, results) {
      if (err) {
        console.error("Database error in getAllowedFeatures:", err);
        return reject(err);
      }

      // Map the result rows to an array of table names
      const allowedTableNames = results.map((row) => row.tableName);
      resolve(allowedTableNames);
    });
  });
}

db_connection.get("/verifyUser/:username", async (req, res) => {
  try {
    const username = req.params.username ? req.params.username.trim() : null;
    if (!username) {
      return res.status(400).json({ error: "Username parameter is required" });
    }

    const exists = await checkUserExists(username);
    res.json({ exists: exists });
  } catch (error) {
    console.error("VerifyUser endpoint error:", error);
    res.status(500).json({ error: "Failed to verify user" });
  }
});

async function checkUserExists(sanitizedUsername) {
  return new Promise((resolve, reject) => {
    con.query(
      "SELECT 1 FROM User WHERE username = ? LIMIT 1",
      [sanitizedUsername],
      function (err, result, fields) {
        if (err) {
          console.error("Database error in checkUserExists:", err);
          return reject(err);
        }
        resolve(result.length > 0);
      }
    );
  });
}

db_connection.post("/checkToken", async (req, res) => {
  try {
    //decrypt request (auth token, session token)
    const decrypted = decryptPayload(req.body.encrypted);


    const { authToken, sessionToken } = JSON.parse(decrypted);
    req.body.authToken = authToken;
    req.body.sessionToken = sessionToken;

    const checkTokenRes = await checkToken(req.body.sessionToken);

    // matching session token and not expired
    if (checkTokenRes.length > 0) {
      // matching auth token
      if (checkTokenRes[0].authToken == req.body.authToken) {
        deleteTokenBySession(req.body.sessionToken);
        res.json({ auth: true, retry: false, expire: false, max: false });
      } else { 
        // wrong auth token, increment number of tries
        updateNumTries(req.body.sessionToken);
        res.json({ auth: false, retry: true, expire: false, max: false });
      }
    } else {
      // check if token expired or max attempts reached, delete from table
      const expired = await checkTokenFailure(req.body.sessionToken);
      deleteTokenBySession(req.body.sessionToken);
      if (expired) {
        res.json({ auth: false, retry: false, expire: true, max: false });
      } else {
        res.json({ auth: false, retry: false, expire: false, max: true });
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Token authentication failed" });
  }
});

// generate uuid4 string
async function getSessionToken() {
  return new Promise ((resolve, reject) => {
    try {
      resolve(uuid4());
    } catch(error) {
      console.log(error);
      reject(error);
    }
  })
}

async function writeToken(email, authToken, sessionToken) {
  return new Promise((resolve, reject) => {
    con.query("DELETE FROM LoginToken WHERE email = ?",
      [email],
      function (err, res) {
        if (err) {
          console.error("Error on deleting potential existing token from database:", err);
        }
        console.log("Successfully deleted potential existing token from database");
      });
    con.query("INSERT INTO LoginToken (email, authToken, expirationTime, sessionToken, numTries) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 5 MINUTE), ?, 0)",
      [email, authToken, sessionToken], 
      function (err, res) {
        if (err) {
          console.error("Error on writing token to database:", err);
          reject(err);
        } else {
          console.log("Successfully wrote token to database");
          resolve(res);
        }
      })
  });
}

async function checkToken(sessionToken) {
  return new Promise((resolve, reject) => {
    con.query("SELECT * FROM LoginToken WHERE sessionToken = ? AND NOW() < expirationTime AND numTries < 5",
      [sessionToken],
      function (err, res) {
        if (err) {
          console.error("Error on checking token in database:", err);
          reject(err);
        }
        resolve(res);
      }
    )
  })
}

async function updateNumTries(sessionToken) {
  return new Promise((resolve, reject) => {
    con.query("UPDATE LoginToken SET numTries = numTries + 1 WHERE sessionToken = ?",
      [sessionToken],
      function (err, res) {
        if (err) {
          console.error("Error on updating numTries in database:", err);
          reject(err);
        }
        resolve(null);
      }
    )
  })
}

async function checkTokenFailure(sessionToken) {
  return new Promise((resolve, reject) => {
    con.query("SELECT * FROM LoginToken WHERE sessionToken = ? AND NOW() > expirationTime",
      [sessionToken],
      function (err, res) {
        if (err) {
          console.error("Error on checking token failure in database:", err);
          reject(err);
        }
        resolve(res.length > 0);
      }
    )
  })
}

async function deleteTokenBySession(sessionToken) {
  return new Promise((resolve, reject) => {
    con.query("DELETE FROM LoginToken WHERE sessionToken = ?",
      [sessionToken],
      function (err, res) {
        if (err) {
          console.error("Error on deleting token in database:", err);
          reject(err);
        }
        resolve(null);
      }
    )
  })
}

module.exports = db_connection;
