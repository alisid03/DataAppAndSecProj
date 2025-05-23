//index.js
const express = require('express');
const app = express();
const cors = require('cors');
const db = require("./db-connection");
const email = require("./send-email");
const admin = require("./admin-functions");

app.use(cors());
app.use(db);
app.use(email);
app.use(admin);

app.listen(8080, () => {
      console.log('server listening on port 8080')
})
