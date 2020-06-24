var express = require("express");
var customerRepo = require("../repos/customerRepo");
const jwt = require('jsonwebtoken');
const moment = require('moment');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const cryptoJS = require('crypto-js')
var _ = require("lodash");

const config = require('../config/default.json');
var verifyConnect = require('../middlewares/verifyConnect.mdw');


var router = express.Router();

router.get("/users", verifyConnect , async (req,res) => {
    const results = await customerRepo.getCustomerById(req.body.userID);

    delete results.password_hash;

    res.json(results);
});

module.exports = router;

