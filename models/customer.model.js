const bcrypt = require('bcryptjs');
const moment = require('moment');
const db = require('../utils/db');

module.exports = {
  add: entity => {
    
    // entity = {
      // "username": "KH1",
      // "password": "111111",
      // "name": "Nguyen Duc Tra",
      // "dob": "1998-08-15",
      // "email":	"ductrapt@gmail.com",
      // "phone": "0344179690",
      // "status": "1",
      // "created_date": moment().format('YYYY-MM-DD HH:mm:ss'),
      // "updated_date": moment().format('YYYY-MM-DD HH:mm:ss')
    // }
    const hash = bcrypt.hashSync(entity.password, 8);
    entity.password = hash;
    return db.add(entity, 'customers');
  },

  singleByUserName: userName => db.load(`select * from customers where username = '${userName}'`),

  updateRefreshToken: async (userId, token) => {

    await db.del({ ID: userId }, 'userRefreshTokenExt');

    const entity = {
      ID: userId,
      refreshToken: token,
      rdt: moment().format('YYYY-MM-DD HH:mm:ss')
    }
    return db.add(entity, 'userRefreshTokenExt');
  },

  verifyRefreshToken: async (userId, token) => {
    const sql = `select * from userRefreshTokenExt where ID = ${userId} and refreshToken = '${token}'`;
    const rows = await db.load(sql);
    if (rows.length > 0)
      return true;

    return false;
  }
};