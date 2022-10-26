let mysql = require("mysql");

const dbInfo = {
  hostName: process.env.DB_HOST,
  userName: process.env.DB_USER,
  userPassword: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME
}

module.exports = function () {
  return (connection = mysql.createConnection({
    host: dbInfo.hostName,
    user: dbInfo.userName,
    password: dbInfo.userPassword,
    database: dbInfo.dbName
  }));
};