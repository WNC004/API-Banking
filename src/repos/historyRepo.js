var db = require("../fn/mysql-db");

exports.add = historyEntity => {
  const {
    id,
    payAccId,
    fromAccNumber,
    toAccNumber,
    amount,
    feeType,
    transactionType,
    message,
    createdAt
  } = historyEntity;

  const sql =
    "insert into `history`(`id`, `payAccId`, `fromAccNumber`, `toAccNumber`, `amount`, `feeType`, `transactionType`, `message`, `createdAt`)" +
    `values('${id}', '${payAccId}', '${fromAccNumber}', '${toAccNumber}','${amount}', '${feeType}', '${transactionType}', '${message}', '${createdAt}');`;
  return db.save(sql);
};

exports.addConnect = historyConnectEntity => {
  const {
    id,
    payAccId,
    fromAccNumber,
    toAccNumber,
    amount,
    feeType,
    transactionType,
    message,
    createdAt,
    bank_id
  } = historyConnectEntity;

  const sql =
    "insert into `history`(`id`, `payAccId`, `fromAccNumber`, `toAccNumber`, `amount`, `feeType`, `transactionType`, `message`, `createdAt`,`bank_id`)" +
    `values('${id}', '${payAccId}', '${fromAccNumber}', '${toAccNumber}','${amount}', '${feeType}', '${transactionType}', '${message}', '${createdAt}','${bank_id}');`;
  return db.save(sql);
};

exports.loadByPayAccId = payAccId => {
  // var sql = `select * from history where payAccId = '${payAccId}'`;
  var sql = `SELECT *  FROM history where payAccId = '${payAccId}' AND (Cast(createdAt as datetime) > DATE_ADD(NOW(), INTERVAL - 30 DAY));`
  return db.load(sql);
};

exports.sumReceiced = (bankName, from, to) =>{
 
  var sql = `SELECT SUM(amount) as sumAmount from history WHERE id is not null `;
  if(bankName!=null && bankName!=undefined && bankName!="" && bankName!="ALL"){
    sql = sql + `and bank_id = '${bankName}' `;
  }
  if(from!=null && from!=undefined && from!=""){
    sql = sql + `and createdAt >= '${from}' `;
  }
  if(to!=null && to!=undefined && to!=""){
    sql = sql + `and createdAt <= '${to}' `;
  }
  console.log(sql);
  return db.load(sql);
}

exports.sumSent = (bankName, from, to) =>{
  //SELECT SUM(amount) as sumAmount from history WHERE transactionType='received' and createdAt >= '2020/06/13' and reatedAt <= '2020/06/26'

  var sql = `SELECT SUM(amount) as sumAmount from history WHERE transactionType='sent' `;
  if(bankName!=null && bankName!=undefined && bankName!="" && bankName!="ALL"){
    sql = sql + `and bank_id = '${bankName}' `;
  }
  if(from!=null && from!=undefined && from!=""){
    sql = sql + `and createdAt >= '${from}' `;
  }
  if(to!=null && to!=undefined && to!=""){
    sql = sql + `and createdAt <= '${to}' `;
  }
  console.log(sql);
  return db.load(sql);
}

exports.getReceiced = (bankName, from, to) =>{
 
  var sql = `SELECT * from history WHERE id is not null `;
  if(bankName!=null && bankName!=undefined && bankName!="" && bankName!="ALL"){
    sql = sql + `and bank_id = '${bankName}' `;
  }
  if(from!=null && from!=undefined && from!=""){
    sql = sql + `and createdAt >= '${from}' `;
  }
  if(to!=null && to!=undefined && to!=""){
    sql = sql + `and createdAt <= '${to}' `;
  }
  console.log(sql);
  return db.load(sql);
}

exports.getSent = (bankName, from, to) =>{
  //SELECT SUM(amount) as sumAmount from history WHERE transactionType='received' and createdAt >= '2020/06/13' and reatedAt <= '2020/06/26'

  var sql = `SELECT * from history WHERE transactionType='sent' `;
  if(bankName!=null && bankName!=undefined && bankName!="" && bankName!="ALL"){
    sql = sql + `and bank_id = '${bankName}' `;
  }
  if(from!=null && from!=undefined && from!=""){
    sql = sql + `and createdAt >= '${from}' `;
  }
  if(to!=null && to!=undefined && to!=""){
    sql = sql + `and createdAt <= '${to}' `;
  }
  console.log(sql);
  return db.load(sql);
}

exports.getBanks = () =>{
 
  var sql = `SELECT * from banks where status = '1';`;
  console.log(sql);
  return db.load(sql);
}