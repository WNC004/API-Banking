var db = require("../fn/mysql-db");

exports.add = contactEntity => {
  const {
    id,
    customerId,
    toAccNumber,
    toNickName,
    createdAt
  } = contactEntity;

  const sql =
    "insert into `contact`(`id`, `customerId`, `toAccNumber`, `toNickName`, `createdAt`)" +
    `values('${id}', '${customerId}', '${toAccNumber}', '${toNickName}', '${createdAt}');`;
  return db.save(sql);
};

exports.loadByCustomerId = customerId => {
  var sql = `select * from contact where customerId = '${customerId}'`;
  return db.load(sql);
};

exports.checkExisted = contactEntity => {
  const { customerId, accNumber } = contactEntity;
  var sql = `select * from contact where customerId = '${customerId}' AND toAccNumber = '${accNumber}'`;
  return db.load(sql);
};


exports.deleteById = id => {
  var sql = `delete from contact where id = '${id}'`;
  return db.load(sql);
};

exports.update = (id, payAccEdit, nickNameEdit) => {
  var sql = `update contact set toAccNumber = '${payAccEdit}', toNickName='${nickNameEdit}' where id = '${id}'`;
  return db.load(sql);
};