To run these files you need these two files:
The client and the server:

Once you have pulled them onto your local desktop:
1. open your terminal and cd into server - To run type `node index.js`
   * This will be the backend of the application
2. Open another terminal cd into the client - to run type `npm run start`
   * This will start the frontend application
  
Along with that that you will need to have a `MySql` database on your local desktop <br />
And you will need to create a table in your database and call it `CS6348` <br />
in `db-connection.js` you will need to type in your password that you would use for your mySql database <br />


The command I used to create the table was:

`CREATE TABLE `user` (

  `username` varchar(255) DEFAULT NULL, 
  
  `password` varchar(255) DEFAULT NULL,
  
  `accessTables` varchar(255) DEFAULT NULL 
  
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`

username and password are used to verify the user
accessTables will be an array of table names (i.e `[user, exmployess, finances]`) which will be the list of the tables that user has access to.
