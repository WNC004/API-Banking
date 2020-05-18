const moment = require('moment');
const bcrypt = require('bcryptjs');
const db = require('../utils/db');

module.exports = {
    add: entity => {
        // entity = {
        //   "username": "admin",
        //   "password_hash": "admin",
        //   "name": "admin",
        //   "email": "admin@g.c",
        //   "dob": "1990-09-09",
        //   "permission": 0
        // }
        const hash = bcrypt.hashSync(entity.password_hash, 8);
        entity.password_hash = hash;
        return db.add(entity, 'users');
    },

    // singleByUserName: userName => db.load(`select * from users where username = '${userName}'`),
    singleByUserName: userName => db.load(`select * from customers where username = '${userName}'`),

    // singleByUserID: userID => db.load(`select * from users where id = ${userID}`),

    singleByUserID: userID => db.load(`select * from customers where ID = ${userID}`)



};