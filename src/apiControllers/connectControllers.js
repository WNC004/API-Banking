var express = require("express");
var payAccRepo = require("../repos/payAccRepo");
var historyRepo = require("../repos/historyRepo");


const jwt = require('jsonwebtoken');
const moment = require('moment');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const cryptoJS = require('crypto-js')
var _ = require("lodash");

const config = require('../config/default.json');
var verifyRSABank = require('../middlewares/verifyConnectRSA.mdw');
var verifyPGPTransfer = require('../middlewares/verifyPGPTransfer.mdw');
var verifyPGPBank = require('../middlewares/verifyConnectPGP.mdw');
var verifyRSATransfer = require('../middlewares/verifyRSATransfer.mdw');


var router = express.Router();

router.post("/RSABank/users", verifyRSABank , async (req,res) => {
    // const results = await customerRepo.getCustomerById(req.body.userID);
    const results = await payAccRepo.loadConnectByAccNumber(req.body.accountID);

    console.log(results);

    res.json(results);
    
});

router.post("/PGPBank/users", verifyPGPBank, async (req, res) => {
    const results = await payAccRepo.loadConnectByAccNumber(req.body.accountID);

    console.log(results);

    res.json(results);
})


router.post("/PGPTransfer", verifyPGPTransfer , async (req,res) => {
    // const results = await payAccRepo.UpdateBalanceByAccNumber(req.body.accountID, req.body.newBalance);
    const accNumber = req.body.accountID;
    // newBalance = số dư cũ + tiền cần nạp;
    const newBalance = req.body.newBalance;
    // msg = lời nhắn
    const message = req.body.msg;

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
        status: "OK",

        });
    })
    .catch(err => {
        console.log(err);
        res.statusCode = 500;
        res.end("View error log on console");
    });
});

router.post("/RSATransfer", verifyRSATransfer , async (req,res) => {
    // const results = await payAccRepo.UpdateBalanceByAccNumber(req.body.accountID, req.body.newBalance);
    const accNumber = req.body.accountID;
    // newBalance = số dư cũ + tiền cần nạp;
    const newBalance = req.body.newBalance;
    // msg = lời nhắn
    const message = req.body.msg;

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
        res.end("View error log on console");
    });


});


module.exports = router;

