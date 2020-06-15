var db = require("../fn/mysql-db");

exports.add = debtEntity => {
  const {
    id,
    customer_id,
    account,
    name_debtors,
    amount,
    message,
    status,
    reason_deleted,
    type,
    createdAt
  } = debtEntity;

  const sql =
    "insert into `debt`(`id`, `customer_id`, `account`, `name_debtors`, `amount`, `message`, `status`,`reason_deleted`, `type`, `createdAt`)" +
    `values('${id}', '${customer_id}','${account}', '${name_debtors}', '${amount}', '${message}', '${status}', '${reason_deleted}', '${type}', '${createdAt}');`;
  return db.save(sql);
};

exports.loadByCustomerId = customerId => {
  var sql = `select * from debt where customerId = '${customerId}' and status='1'`;
  return db.load(sql);
};

exports.checkExisted = contactEntity => {
  const { customerId, accNumber } = contactEntity;
  var sql = `select * from contact where customerId = '${customerId}' AND toAccNumber = '${accNumber}'`;
  return db.load(sql);
};


exports.deleteById = (id, reason_deleted) => {
  var sql = `update debt set status='0' and reason_deleted='${reason_deleted}' where id = '${id}'`;
  return db.load(sql);
};