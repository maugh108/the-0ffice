const mysql = require("mysql2");

require('dotenv').config()

const db = mysql.createConnection(
  {
    host: "localhost",
    database: process.env.db_name,
    user: process.env.db_user,
    password: process.env.db_pw
  },
  console.log('Welcome to The 0ffice (a not official The Office simulator)')
);

module.exports = db;