var express = require("express");
var shortid = require("shortid");
var moment = require("moment");
var _ = require("lodash");

var contactRepo = require("../repos/contactRepo");

var router = express.Router();

router.post("/contact", (req, res) => {
    const _contact = req.body;
    _contact.id = shortid.generate();
    _contact.createdAt = moment().format("YYYY-MM-DD HH:mm");
    contactRepo
        .add(_contact)
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

router.get("/contacts/:customerId", (req, res) => {
    const { customerId } = req.params;

    contactRepo
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
