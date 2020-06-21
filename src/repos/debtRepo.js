var db = require("../fn/mysql-db");

exports.add = debtEntity => {
  const {
    id,
    debtor_id,
    account,
    name_debtors,
    amount,
    msg,
    status,
    reason_deleted,
    type,
    createdAt,
    creditor_id,
    creditor_name,
    email_debtor,
    account_creditor,
    creditor_email
  } = debtEntity;

  const sql =
    "insert into `debt`(`id`, `debtor_id`, `account`, `name_debtors`, `amount`, `msg`, `status`,`reason_deleted`, `type`, `createdAt`, `creditor_id`, `creditor_name`, `email_debtor`, `account_creditor`, `creditor_email`)" +
    `values('${id}', '${debtor_id}','${account}', '${name_debtors}', '${amount}', '${msg}', '${status}', '${reason_deleted}', '${type}', '${createdAt}', '${creditor_id}', '${creditor_name}', '${email_debtor}', '${account_creditor}', '${creditor_email}');`;
  return db.save(sql);
};

exports.loadByCustomerId = customerId => {
  var sql = `select * from debt where creditor_id = '${customerId}' and status='1' and amount > '0'`;
  return db.load(sql);
};

exports.loadByDebtor = customerId => {
  var sql = `select * from debt where debtor_id = '${customerId}' and status='1' and amount > '0'`;
  return db.load(sql);
};

exports.checkExisted = contactEntity => {
  const { customerId, accNumber } = contactEntity;
  var sql = `select * from contact where customerId = '${customerId}' AND toAccNumber = '${accNumber}'`;
  return db.load(sql);
};

exports.loadById = id => {
  var sql = `select * from debt where id = '${id}'`;
  return db.load(sql);
};

exports.deleteById = (id, reason_deleted) => {
  var sql = `update debt set status='0', reason_deleted='${reason_deleted}' where id = '${id}'`;
  return db.load(sql);
};