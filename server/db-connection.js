var mysql = require("mysql2");
const express = require("express");
const db_connection = express();
db_connection.use(express.json());
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

//getData function with Whitelisting
async function getData(tableName) {
  return new Promise((resolve, reject) => {
    if (!ALLOWED_TABLE_NAMES.includes(tableName)) {
      console.error(`Attempt to query disallowed table: ${tableName}`);

      return reject(new Error("Invalid table name specified."));
    }

    con.query(`SELECT * FROM ${tableName}`, function (err, result) {
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

db_connection.post("/getUser", async (req, res) => {
  try {
    const userResult = await getUsers(req);

    let responseData = { status: "REJECTED" };

    if (userResult && userResult.password == req.body.password) {
      responseData = { ...userResult, status: "ACCEPTED" };
      delete responseData.password;
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
    if (!req.body.username || !req.body.password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }
    const username = req.body.username.trim();
    const password = req.body.password;

    if (!username) {
      return res.status(400).json({ error: "Username cannot be empty" });
    }

    const result = await createUser(username, password);
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

async function createUser(sanitizedUsername, password) {
  return new Promise((resolve, reject) => {
    con.query(
      "INSERT INTO User (username, password) VALUES (?, ?)",
      [sanitizedUsername, password],
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

async function requestAccess(sanitizedUsername, sanitizedFeature) {
  return new Promise((resolve, reject) => {
    con.query(
      "INSERT INTO requests (username, page, request_time) VALUES (?, ?, NOW())",
      [sanitizedUsername, sanitizedFeature],
      function (err, result, fields) {
        if (err) {
          console.error("Database error in requestAccess:", err);
          return reject(err);
        }
        resolve(result);
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

module.exports = db_connection;
