const express = require('express');
const jwt = require('jsonwebtoken');
const randToken = require('rand-token');
// const jwt_decode = require('jwt-decode');
const createError = require('http-errors');

const authModel = require('../models/auth.model');
const userModel = require('../models/customer.model');

const config = require('../config/default.json');

const router = express.Router();

/**
 * login
 */

router.post('/', async (req, res) => {
  // req.body = {
  //   "user": "admin",
  //   "pwd": "admin"
  // }

  const ret = await authModel.login(req.body);
  if (ret === null) {
    return res.json({
      authenticated: false
    })
  }

  const userId = ret.id;
  const accessToken = generateAccessToken(userId);

  const refreshToken = randToken.generate(config.auth.refreshTokenSz);
  await userModel.updateRefreshToken(userId, refreshToken);

  res.json({
    // authenticated: true,
    accessToken,
    refreshToken
  })
})

/**
 * refresh token
 */

router.post('/refresh', async (req, res) => {
  // req.body = {
  //   accessToken,
  //   refreshToken
  // }

  // const { userId } = jwt_decode(req.body.accessToken);
  jwt.verify(req.body.accessToken, config.auth.secret, { ignoreExpiration: true }, async function (err, payload) {
    const { userId } = payload;
    const ret = await userModel.verifyRefreshToken(userId, req.body.refreshToken);
    if (ret === false) {
      throw createError(400, 'Invalid refresh token.');
    }

    const accessToken = generateAccessToken(userId);
    res.json({ accessToken });
  })
});

const generateAccessToken = userId => {
  const payload = { userId };
  const accessToken = jwt.sign(payload, config.auth.secret, {
    expiresIn: config.auth.expiresIn
  });

  return accessToken;
}

module.exports = router;