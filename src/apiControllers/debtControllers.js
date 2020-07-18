var express = require("express");
var shortid = require("shortid");
var moment = require("moment");
var _ = require("lodash");

var customerRepo = require("../repos/customerRepo");
var debtRepo = require("../repos/debtRepo");
var payAccRepo = require("../repos/payAccRepo");
var nodemailer = require("./../fn/nodemailer");
var historyRepo = require("../repos/historyRepo");

var router = express.Router();

router.post("/debt", async(req, res) => {
    const _debt = req.body;
    _debt.id = shortid.generate();
    _debt.createdAt = moment().format("YYYY-MM-DD HH:mm");
    let user = await customerRepo.getCustomerById(_debt.creditor_id);
    _debt.creditor_name = user[0].name;
    _debt.creditor_email = user[0].email;
    
    let acc = await payAccRepo.loadPaymentAccByCustomerId(_debt.creditor_id, '1')
    _debt.account_creditor = acc[0].accNumber;
    let debtors = await customerRepo.getCustomerByAccount(_debt.account);
    let debtor = debtors[0];
    if(debtor != null){
        _debt.debtor_id = debtor.customerId;
        _debt.name_debtors = debtor.name;
        _debt.email_debtor = debtor.email;
        _debt.status = '1';
        _debt.reason_deleted = '';
        _debt.type = '1'; // tu tao
        debtRepo
            .add(_debt)
            .then(() => {
                res.statusCode = 201;
                res.json(req.body);
            })
            .catch(err => {
                console.log(err);
                res.statusCode = 500;
                res.json({
                    status: "UNKNOWN_ERROR",
                    message: err
                });
            });
    }
    else{
        res.statusCode = 200;
        res.json({
            status: "UNKNOWN_ERROR",
            message: "This acount is not exist"
        });
    }
    
});

router.get("/debts/:customerId", (req, res) => {
    const { customerId } = req.params;

    debtRepo
        .loadByCustomerId(customerId)
        .then(rows => {
            res.statusCode = 200;
            // res.json(rows);
            res.send(
                _.sortBy(JSON.parse(JSON.stringify(rows)), [
                    function (o) {
                        return o.createdAt;
                    }
                ]).reverse()
            );
        })
        .catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.end("View error log on console");
        });
});

router.get("/debts/other/:customerId", (req, res) => {
    const { customerId } = req.params;

    debtRepo
        .loadByDebtor(customerId)
        .then(rows => {
            res.statusCode = 200;
            // res.json(rows);
            res.send(
                _.sortBy(JSON.parse(JSON.stringify(rows)), [
                    function (o) {
                        return o.createdAt;
                    }
                ]).reverse()
            );
        })
        .catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.end("View error log on console");
        });
});
router.get("/contact/:accNumber/is-existed", (req, res) => {
    const { customerId } = req.query;
    const { accNumber } = req.params;
    const contactEntity = { customerId, accNumber }

    contactRepo
        .checkExisted(contactEntity)
        .then(rows => {
            res.statusCode = 200;
            if (rows.length > 0) {
                res.json({ "existed": "1" });
            } else {
                res.json({ "existed": "0" });
            }
        })
        .catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.end("View error log on console");
        });
});

router.post("/contact/:contactId/delete", (req, res) => {
    const { contactId } = req.params;
    contactRepo
        .deleteById(contactId)
        .then(() => {
            res.statusCode = 201;
            res.json({ "deleted": "ok" });
        })
        .catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.json({
                status: "UNKNOWN_ERROR",
                message: err
            });
        });
});

router.post("/debt/delete", async(req, res) => {
    const id = req.body.debtId;
    const customerId = req.body.customerId;
    let debt = await debtRepo.loadById(id);
    const reason_deleted = req.body.reason;
    console.log(customerId);
    console.log(reason_deleted);
    debtRepo
    .deleteById(id, reason_deleted)
    .then(() => {
        let clientEmail;
        let clientName;
        let action;
        if(customerId == debt[0].debtor_id){
            console.log("=1");
            clientEmail = debt[0].creditor_email;
            clientName = debt[0].creditor_name;
            action = debt[0].name_debtors;
        }
        else{
            console.log("=2");
            clientEmail = debt[0].email_debtor;
            clientName = debt[0].name_debtors;
            action = debt[0].creditor_name;
        }
        console.log("abcxyz");
        console.log(clientEmail);
        console.log(clientName);
        const verifyEntity = {
            clientEmail,
            clientName,
            action
          };
          nodemailer.sendNotificationDeleteDebt(verifyEntity);
        res.statusCode = 200;
        res.json(req.body);
    })
    .catch(err => {
        console.log(err);
        res.statusCode = 500;
        res.json({
            status: "UNKNOWN_ERROR",
            message: err
        });
    });
});

router.post("/debt/notify", async(req, res) => {
    console.log("abc");
    const id = req.body.id;
    const email_debtor = req.body.email_debtor;
    let debt = await debtRepo.loadById(id);
    try {
        const verifyEntity = {
            clientEmail: debt[0].email_debtor,
            creditor: debt[0].creditor_name,
            amount: debt[0].amount,
            debtor: debt[0].name_debtors
        };
        console.log(debt[0].email_debtor);
        nodemailer.sendNotification(verifyEntity);
        res.statusCode = 200;
        res.json(req.body);
    } catch (error) {
    
        res.statusCode = 500;
        res.json(req.body);
    }
    
});

router.post("/debt/tranfer", async(req, res) => {
    const {customerId, debtId, messagePay, toAccount, amount} =  req.body;
    let balances = await payAccRepo.checkPaymentAccByCustomerId(customerId, '1');
    const balance = balances[0].balance;
    console.log(balance);
    const totalAmount = parseInt(balance) - parseInt(amount) - parseInt(10000);
    console.log(amount);
    console.log(totalAmount);
    debtRepo
    .tranfer(debtId, totalAmount, toAccount, '1')
    .then(async() => {
        const _history = new Object();
        _history.id = shortid.generate();
        _history.createdAt = moment().format("YYYY-MM-DD HH:mm");
        _history.payAccId = balances[0].id;
        _history.fromAccNumber = balances[0].accNumber;
        _history.toAccNumber = toAccount;
        _history.amount = amount;
        _history.feeType = -10000;
        _history.transactionType = "debt";
        _history.bank_id = '0';
        _history.message = messagePay;
        await historyRepo.add(_history);
        let toAccountInSystem = await payAccRepo.loadByAccNumber(toAccount);
        const toAccountId = toAccountInSystem[0].id;
        _history.id = shortid.generate();
        _history.payAccId = toAccountId;
        _history.feeType = 0;
        _history.transactionType = "received";
        await historyRepo.add(_history);
        res.statusCode = 200;
        res.json({
            message: "Success"
        });
    })
    .catch(err => {
        console.log(err);
        res.statusCode = 500;
        res.json({
            status: "UNKNOWN_ERROR",
            message: err
        });
    });
});

router.post("/debt/send-otp", (req, res) => {
    const { clientEmail, clientName } = req.body;
    const otp = require("rand-token")
      .generator({
        chars: "numeric"
      })
      .generate(6);
  
    const verifyEntity = {
      clientEmail,
      clientName,
      otp
    };
    nodemailer.sendMail(verifyEntity);
    res.statusCode = 201;
    res.json({ otp: otp });
  });

module.exports = router;
