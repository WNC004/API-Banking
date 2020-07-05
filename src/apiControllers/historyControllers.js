var express = require("express");
var shortid = require("shortid");
var moment = require("moment");
var _ = require("lodash");

var historyRepo = require("../repos/historyRepo");

var router = express.Router();

router.post("/history", (req, res) => {
    const _history = req.body;
    _history.id = shortid.generate();
    _history.createdAt = moment().format("YYYY-MM-DD HH:mm");
    historyRepo
        .add(_history)
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

router.post("/historyConnect", (req, res) => {
    const _history = req.body;
    _history.id = shortid.generate();
    _history.createdAt = moment().format("YYYY-MM-DD HH:mm");
    historyRepo
        .addConnect(_history)
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

router.get("/histories/:payAccId", (req, res) => {
    const { payAccId } = req.params;

    historyRepo
        .loadByPayAccId(payAccId)
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

router.get("/histories-acc/:accNumber", (req, res) => {
    const { accNumber } = req.params;

    historyRepo
        .loadByPayAccNumber(accNumber)
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

router.post("/histories/received", (req, res) => {
    const { bankName, from, to } = req.body;

    historyRepo
        .sumReceiced(bankName, from, to)
        .then(rows => {
            res.statusCode = 200;
            var sum = 0;
            if (rows.length > 0) {
                sum = rows[0].sumAmount;
            }
            res.json(sum);
        })
        .catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.end("View error log on console");
        });
});

router.post("/histories/sent", (req, res) => {
    const { bankName, from, to } = req.body;

    historyRepo
        .sumSent(bankName, from, to)
        .then(rows => {
            res.statusCode = 200;
            var sum = 0;
            if (rows.length > 0) {
                sum = rows[0].sumAmount;
            }
            res.json(sum);
        })
        .catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.end("View error log on console");
        });
});

router.post("/histories/received-list", (req, res) => {
    const { bankName, from, to } = req.body;

    historyRepo
        .getReceiced(bankName, from, to)
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

router.post("/histories/sent-list", (req, res) => {
    const { bankName, from, to } = req.body;

    historyRepo
        .getSent(bankName, from, to)
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

router.post("/histories/banks", (req, res) => {
    historyRepo
        .getBanks()
        .then(rows => {
            res.statusCode = 200;
            console.log(JSON.parse(JSON.stringify(rows)));
            // res.json(rows);
            res.send(
                _.sortBy(JSON.parse(JSON.stringify(rows)), [
                    function (o) {
                        return o.id;
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

module.exports = router;
