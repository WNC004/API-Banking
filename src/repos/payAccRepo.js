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
    createdAt,
    type
  } = payAccEntity;

  const sql =
    "insert into `payacc`(`id`, `customerId`, `clientEmail`, `clientName`, `phone`, `accNumber`, `balance`, `status`, `createdAt`,`type`)" +
    `values('${id}', '${customerId}', '${clientEmail}','${clientName}','${phone}','${accNumber}','${balance}', '${status}', '${createdAt}',${type});`;
  return db.save(sql);
};

exports.addSavingAcc = payAccEntity => {
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

exports.loadPaymentByCustomerId = customerId => {
  var sql = `select * from payacc where customerId = '${customerId}' and type = '1'`;
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

exports.UpdateConnectBalanceById = payAccEntity => {
  const { payAccId, updateBalance } = payAccEntity;
  var sql =
    "update payacc set balance = " +
    `'${updateBalance}'` +
    " where id=" +
    `'${payAccId}';`;
  return db.save(sql);
};

exports.loadByAccNumber = accNumber => {
  var sql = `select * from payacc where accNumber = '${accNumber}'`;
  return db.load(sql);
};

exports.loadConnectByAccNumber = accNumber => {
  var sql = `select clientEmail, clientName, phone from payacc where accNumber = '${accNumber}'`;
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

exports.loadPaymentAccByCustomerId = (customerId, type) => {
  var sql = `select * from payacc where customerId = '${customerId}' and type = '${type}'`;
  return db.load(sql);
};

exports.UpdateBalanceByAccNumber = (accNumber, newBalance) => {
  // const { accNumber, newBalance } = payAccEntity;
    // const payAccEntity = {
    // accNumber,
    // newBalance,
    // message,
    // senderName,
    // senderNumber
    // }
  var sql =
    "update payacc set balance = " +
    `'${newBalance}'` +
    " where accNumber=" +
    `'${accNumber}';`;
  return db.save(sql);
};

exports.checkPaymentAccByCustomerId = (customerId, type) => {
  var sql = `select balance, id, accNumber from payacc where customerId = '${customerId}' and type = '${type}'`;
  return db.load(sql);
};

exports.getBanks = () =>{
 
  var sql = `SELECT * from banks where status = '1' and id != 'ALL';`;
  console.log(sql);
  return db.load(sql);
}