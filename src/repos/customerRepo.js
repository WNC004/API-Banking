var db = require("../fn/mysql-db");
var md5 = require("crypto-js/md5");

exports.getCustomers = () => {
  const sql = `select f_id as customerId, f_username as username, f_email as email, f_name as name, f_phone as phone, f_createdAt as createdAt from users where f_type = 1`;
  return db.load(sql);
};

exports.getCustomerByAccount = account => {
  const sql = `select f_id as customerId, f_username as username, f_email as email, f_name as name from users where f_id in (select customerId from payacc where accNumber='${account}')`;
  return db.load(sql);
};

exports.changePassword = (newPassWord, id) => {
  var md5_pwd = md5(newPassWord);
  var sql = `update users set f_password = '${md5_pwd}'  where f_id = '${id}'`;
  return db.load(sql);
};

exports.getCustomerById = id => {
  const sql = `select f_email as email, f_username as username, f_name as name from users where f_id = '${id}'`;
  return db.load(sql);
};

exports.forgotPassword = (password, email) => {
  var md5_pwd = md5(password);
  var sql = `update users set f_password = '${md5_pwd}'  where f_email = '${email}'`;
  return db.load(sql);
};