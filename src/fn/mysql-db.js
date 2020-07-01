var mysql = require("mysql");

var createConnection = () => {
  return mysql.createConnection({
    // host: "localhost",
    // port: '3306',
    // user: "root",
    // password: "password",
    // database: "banking"
    
    host: "db4free.net",
    user: "wnc004",
    password: "P@ssword123456",
    database: "wnc004"
  });
};

exports.load = sql => {
  return new Promise((resolve, reject) => {
    var cn = createConnection();
    cn.connect();
    cn.query(sql, (err, rows, fields) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
      cn.end();
    });
  });
};

exports.save = sql => {
  return new Promise((resolve, reject) => {
    var cn = createConnection();
    cn.connect();
    cn.query(sql, (err, value) => {
      if (err) {
        reject(err);
      } else {
        resolve(value);
      }
      cn.end();
    });
  });
};
