var db = require("../fn/mysql-db");

exports.getStaffs = () => {
    const sql = `select f_id as staffId, f_email as email, f_name as name, f_phone as phone, f_createdAt as createdAt from users where f_type = 2`;
    return db.load(sql);
};



