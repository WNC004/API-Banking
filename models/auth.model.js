const bcrypt = require('bcryptjs');
const userModel = require('./customer.model');
const db = require('../utils/db');

module.exports = {
  login: async entity => {
    // entity = {
    //   "user": "admin",
    //   "pwd": "admin"
    // }

    const rows = await userModel.singleByUserName(entity.user);
    if (rows.length === 0)
      return null;
    
    const hashPwd = rows[0].password;
    if (bcrypt.compareSync(entity.pwd, hashPwd)) {
      return rows[0];
    }

    return null;
  }
};