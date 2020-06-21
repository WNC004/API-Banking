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
    account_creditor
  } = debtEntity;

  const sql =
    "insert into `debt`(`id`, `debtor_id`, `account`, `name_debtors`, `amount`, `msg`, `status`,`reason_deleted`, `type`, `createdAt`, `creditor_id`, `creditor_name`, `email_debtor`, `account_creditor`)" +
    `values('${id}', '${debtor_id}','${account}', '${name_debtors}', '${amount}', '${msg}', '${status}', '${reason_deleted}', '${type}', '${createdAt}', '${creditor_id}', '${creditor_name}', '${email_debtor}', '${account_creditor}');`;
  return db.save(sql);
};

exports.loadByCustomerId = customerId => {
  var sql = `select * from debt where creditor_id = '${customerId}' and status='1'`;
  return db.load(sql);
};

exports.loadByDebtor = customerId => {
  var sql = `select * from debt where debtor_id = '${customerId}' and status='1'`;
  return db.load(sql);
};

exports.checkExisted = contactEntity => {
  const { customerId, accNumber } = contactEntity;
  var sql = `select * from contact where customerId = '${customerId}' AND toAccNumber = '${accNumber}'`;
  return db.load(sql);
};


exports.deleteById = (id, reason_deleted) => {
  var sql = `update debt set status='0', reason_deleted='${reason_deleted}' where id = '${id}'`;
  return db.load(sql);
};