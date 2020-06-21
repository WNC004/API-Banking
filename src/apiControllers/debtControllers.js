var express = require("express");
var shortid = require("shortid");
var moment = require("moment");
var _ = require("lodash");

var customerRepo = require("../repos/customerRepo");
var debtRepo = require("../repos/debtRepo");
var payAccRepo = require("../repos/payAccRepo");

var router = express.Router();

router.post("/debt", async(req, res) => {
    const _debt = req.body;
    _debt.id = shortid.generate();
    _debt.createdAt = moment().format("YYYY-MM-DD HH:mm");
    console.log(_debt.creditor_id);
    let user = await customerRepo.getCustomerById(_debt.creditor_id);
    console.log(user[0].name);
    _debt.creditor_name = user[0].name;
    _debt.email_debtor = user[0].email;
    let acc = await payAccRepo.loadPaymentAccByCustomerId(_debt.creditor_id, '1')
    _debt.account_creditor = acc[0].accNumber;
    let debtors = await customerRepo.getCustomerByAccount(_debt.account);
    let debtor = debtors[0];
    if(debtor != null){
        _debt.debtor_id = debtor.customerId;
        _debt.name_debtors = debtor.name;
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

    console.log(req.param);

    debtRepo
        .loadByCustomerId(customerId)
        .then(rows => {
            console.log(rows);
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

    console.log(req.param);

    debtRepo
        .loadByDebtor(customerId)
        .then(rows => {
            console.log(rows);
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
            console.log(rows);
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
    const reason_deleted = req.body.reason;
    console.log(id);
    console.log(reason_deleted);
    debtRepo
    .deleteById(id, reason_deleted)
    .then(() => {
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
module.exports = router;
