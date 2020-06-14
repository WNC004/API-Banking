var db = require("../fn/mysql-db");

exports.add = payAccEntity => {
  const {
    id,
    customerId,
    clientEmail,
    clientName,
    phone,
    accNumber,
    balance,
    status,
    createdAt
  } = payAccEntity;

  const sql =
    "insert into `payacc`(`id`, `customerId`, `clientEmail`, `clientName`, `phone`, `accNumber`, `balance`, `status`, `createdAt`)" +
    `values('${id}', '${customerId}', '${clientEmail}','${clientName}','${phone}','${accNumber}','${balance}', '${status}', '${createdAt}');`;
  return db.save(sql);
};

exports.loadAll = () => {
  var sql = `select * from payacc`;
  return db.load(sql);
};

exports.loadByCustomerId = customerId => {
  var sql = `select * from payacc where customerId = '${customerId}'`;
  return db.load(sql);
};

exports.UpdateBalanceById = payAccEntity => {
  const { payAccId, newBalance } = payAccEntity;
  var sql =
    "update payacc set balance = " +
    `'${newBalance}'` +
    " where id=" +
    `'${payAccId}';`;
  return db.save(sql);
};

exports.loadByAccNumber = accNumber => {
  var sql = `select * from payacc where accNumber = '${accNumber}'`;
  return db.load(sql);
};


exports.loadByOpen = openStatus => {
  var sql = `select * from payacc where status = '${openStatus}'`;
  return db.load(sql);
};

exports.UpdateStatusById = payAccEntity => {
  const { payAccId, newBalance, newStatus } = payAccEntity;
  var sql =
    "update payacc set balance = " +
    `'${newBalance}'` +
    " , status = " +
    `'${newStatus}'` +
    " where id=" +
    `'${payAccId}';`;
  return db.save(sql);
};