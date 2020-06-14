var jwt = require("jsonwebtoken");
var rndToken = require("rand-token");
var moment = require("moment");
var md5 = require("crypto-js/md5");
var db = require("../fn/mysql-db");

const SECRET = "ABCDEF";
const AC_LIFETIME = 60000; // seconds
exports.LIFETIME = () => {
  return AC_LIFETIME;
};
exports.generateAccessToken = userEntity => {
  var payload = {
    user: userEntity
  };

  var token = jwt.sign(payload, SECRET, {
    expiresIn: AC_LIFETIME
  });

  return token;
};

exports.verifyAccessToken = (req, res, next) => {
  var token = req.headers["x-access-token"];
  console.log(token);

  if (token) {
    jwt.verify(token, SECRET, (err, payload) => {
      if (err) {
        res.statusCode = 401;
        if (err.name === "TokenExpiredError") {
          res.json({
            msg: "TOKEN_EXPIRED"
          });
        } else {
          res.json({
            msg: "INVALID_TOKEN"
          });
        }
      } else {
        console.log(payload);
        req.token_payload = payload;
        next();
      }
    });
  } else {
    res.statusCode = 403;
    res.json({
      msg: "NO_TOKEN"
    });
  }
};

exports.generateRefreshToken = () => {
  const SIZE = 80;
  return rndToken.generate(SIZE);
};

exports.updateRefreshToken = (userId, rfToken) => {
  return new Promise((resolve, reject) => {
    var sql = `delete from userreftokenext where f_userId = '${userId}'`;
    db.save(sql) // delete
      .then(value => {
        var rdt = moment().format("YYYY-MM-DD HH:mm:ss");
        sql = `insert into userreftokenext values('${userId}', '${rfToken}', '${rdt}')`;
        return db.save(sql);
      })
      .then(value => resolve(value))
      .catch(err => reject(err));
  });
};

exports.getNewAccessToken = rfToken => {
  return new Promise((resolve, reject) => {
    var sql = `select f_userId from userreftokenext where f_refToken = '${rfToken}'`;
    db.load(sql)
      .then(rows => {
        console.log("userID ->");
        if (rows.length !== 0) {
          let userId = rows[0].f_userId;
          console.log(userId);
          let sql_user = `select * from users where f_id = '${userId}'`;
          db.load(sql_user)
            .then(rows_user => {
              console.log(`user at id = '${userId}'`);
              console.log(rows_user);
              if (rows_user.length !== 0) {
                let userEntity = rows_user[0];
                let access_token = this.generateAccessToken(userEntity);
                resolve(access_token);
              } else {
                reject({
                  errMsg: "NO_USER_EXISTED"
                });
              }
            })
            .catch(err =>
              reject({
                err,
                errMsg: "DB_QUERY_ERROR"
              })
            );
        } else {
          reject({
            errMsg: "NO_REFRESH_TOKEN"
          });
        }
      })
      .catch(err =>
        reject({
          err,
          errMsg: "DB_QUERY_ERROR"
        })
      );
  });
};

exports.add = (userEntity, id) => {
  // userEntity = {
  //     Username: 1,
  //     Password: 'raw pwd',
  //     Name: 'name',
  //     Phone: 01231412313
  //     Type: 0
  // }
  // var id = uid(10);
  var md5_pwd = md5(userEntity.Password);
  var sql = `insert into users(f_id, f_password, f_username, f_email, f_name , f_phone, f_type, f_createdAt) values('${id}','${md5_pwd}', '${
    userEntity.Username
  }', '${userEntity.Email}', '${userEntity.Name}', '${userEntity.Phone}',  ${
    userEntity.Type
  }, '${moment().format("YYYY-MM-DD HH:mm")}')`;

  return db.save(sql);
};

exports.login = loginEntity => {
  var md5_pwd = md5(loginEntity.pwd);
  console.log(md5_pwd);
  var sql = `select * from users where f_username = '${
    loginEntity.username
  }' and f_password = '${md5_pwd}'`;
  return db.load(sql);
};