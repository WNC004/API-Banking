var db = require("../fn/mysql-db");

exports.getStaffs = () => {
    const sql = `select f_id as staffId, f_email as email, f_name as name, f_phone as phone, f_createdAt as createdAt from users where f_type = 2`;
    return db.load(sql);
};

exports.getStaffById = (id) => {
    const sql = `select f_id as staffId, f_email as email, f_name as name, f_phone as phone, f_createdAt as createdAt from users where f_type = 2 and f_id = '${id}'`;
    return db.load(sql);
};

exports.deleteById = (id) => {
    var sql = `update users set f_type=0 where f_id = '${id}'`;
    return db.load(sql);
};

exports.loadById = id => {
    var sql = `select * from debt where f_id = '${id}'`;
    return db.load(sql);
};

exports.update = (id,name,email,phone) => {
    var sql = `update users set f_name = '${name}', f_email='${email}', f_phone='${phone}' where f_id = '${id}'`;
    return db.load(sql);
};

exports.loadByEmail = email => {
    var sql = `select * from users where f_email = '${email}'`;
    return db.load(sql);
}

exports.loadByPhone = phone => {
    var sql = `select * from users where f_phone = '${phone}'`;
    return db.load(sql);
}