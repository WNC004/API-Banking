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

module.exports = router;
