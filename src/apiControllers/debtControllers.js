var express = require("express");
var shortid = require("shortid");
var moment = require("moment");
var _ = require("lodash");

var customerRepo = require("../repos/customerRepo");
var debtRepo = require("../repos/debtRepo");

var router = express.Router();

router.post("/debt", async(req, res) => {
    const _debt = req.body;
    _debt.id = shortid.generate();
    _debt.createdAt = moment().format("YYYY-MM-DD HH:mm");
    let debtors = await customerRepo.getCustomerByAccount(_debt.account);
    let debtor = debtors[0];
    console.log("aaa");
    console.log(_debt);
    console.log(debtor);
    _debt.debtor_id = debtor.customerId;
    _debt.name_debtors = debtor.name;
    _debt.status = '1';
    _debt.reason_deleted = '';
    _debt.type = '1'; // tu tao
    console.log(_debt);
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


module.exports = router;
