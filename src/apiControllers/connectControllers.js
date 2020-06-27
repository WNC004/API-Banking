var express = require("express");
var customerRepo = require("../repos/customerRepo");
var payAccRepo = require("../repos/payAccRepo");

const jwt = require('jsonwebtoken');
const moment = require('moment');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const cryptoJS = require('crypto-js')
var _ = require("lodash");

const config = require('../config/default.json');
var verifyConnect = require('../middlewares/verifyConnect.mdw');
var verifyPGP = require('../middlewares/verifyPGP.mdw');


var router = express.Router();

router.get("/users", verifyConnect , async (req,res) => {
    // const results = await customerRepo.getCustomerById(req.body.userID);
    const results = await payAccRepo.loadConnectByAccNumber(req.body.accountID);

    console.log(results);

    res.json(results);

});


router.post("/PGP/users", verifyPGP , async (req,res) => {
    // const results = await payAccRepo.UpdateBalanceByAccNumber(req.body.accountID, req.body.newBalance);
    const accNumber = req.body.accountID;
    // newBalance = số dư cũ + tiền cần nạp;
    const newBalance = req.body.newBalance;
    console.log(req.body);

    const payAccEntity = {
    accNumber,
    newBalance
    }

    payAccRepo
    .UpdateBalanceByAccNumber(payAccEntity)
    .then(result => {
        console.log(result);
        res.statusCode = 201;
        res.json({
        status: "OK"
        });
    })
    .catch(err => {
        console.log(err);
        res.statusCode = 500;
        console.log(req.body);
        res.end("View error log on console");
    });
});


module.exports = router;

