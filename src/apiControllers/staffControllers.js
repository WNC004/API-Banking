var express = require("express");
var staffRepo = require("../repos/staffRepo");
const jwt = require('jsonwebtoken');
const moment = require('moment');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const cryptoJS = require('crypto-js')
var _ = require("lodash");

const config = require('../config/default.json');
var router = express.Router();

router.get("/staffs", (req, res) => {
    staffRepo.getStaffs().then(rows => {
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
            res.status(500).end("View error log on console");
        });
});

router.get("/staffs/:staffId", (req, res) => {
    const { staffId } = req.params;

    staffRepo
        .getStaffById(staffId)
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


router.post("/staffs/delete", (req, res) => {
    // const id  = req.body.id;
    staffRepo
    .deleteById(req.body.staffId)
    .then(rows => {
        res.statusCode = 201;
        // res.send(
        //     _.sortBy(JSON.parse(JSON.stringify(rows)), [
        //         function (o) {
        //             return o.createdAt;
        //         }
        //     ]).reverse()
        // );
        res.json({ "update": "ok" });
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


router.post("/staffs/edit", (req, res) => {
    const id = req.body.staffId;
    const name = req.body.staffName;
    const email = req.body.staffEmail;
    const phone = req.body.phone;
    console.log(id);
    console.log(name);
    console.log(email);
    console.log(phone);

    staffRepo
        .update(id, name, email, phone)
        .then(() => {
            res.statusCode = 201;
            res.json({ "update": "ok" });
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
