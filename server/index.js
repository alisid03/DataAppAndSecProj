//index.js
const express = require('express');
const app = express();
const cors = require('cors');
const db = require("./db-connection");

app.use(cors());
app.use(db);

app.listen(8080, () => {
      console.log('server listening on port 8080')
})
