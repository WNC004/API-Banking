var db = require("../fn/mysql-db");

exports.getCustomers = () => {
  const sql = `select f_id as customerId, f_email as email, f_name as name, f_phone as phone, f_createdAt as createdAt from users where f_type = 1`;
  return db.load(sql);
};

exports.getCustomerByAccount = account => {
  const sql = `select f_id as customerId, f_email as email, f_name as name from users where f_id in (select customerId from payacc where accNumber='${account}')`;
  return db.load(sql);
};

