const mysql = require('mysql');
require('dotenv').config();

var connection = mysql.createConnection({
    // port: process.env.DB_PORT,
    // host: process.env.DB_HOST,
    // user: process.env.DB_USER,
    // password: process.env.DB_PASSWORD,
    // database: process.env.DB_NAME
    port: 3306,
    host: 'localhost',
    user: 'root',
    password: 'password@123', //'password
    database: 'CafeMangement'
});
connection.connect((err)=>{
    if(!err){
        console.log("'CafeMangement' DATABASE CONNECTED");
    }
    else{
        console.log(err, "failled to connect");
    }
});

module.exports = connection;