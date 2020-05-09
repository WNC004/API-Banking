const jwt = require('jsonwebtoken');
const createError = require('http-errors');

const config = require('../config/default.json');

module.exports = function (req, res, next) {
  const token = req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, config.auth.secret, function (err, payload) {
      if (err)
        throw createError(401, err);

      // console.log(payload);
      req.tokenPayload = payload;
      next();
    })
  } else {
    throw createError(401, 'No accessToken found.');
  }
}
