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


router.post("/staffs/edit", async(req, res) => {
    const id = req.body.staffId;
    const name = req.body.staffName;
    const email = req.body.staffEmail;
    let emailDB = await staffRepo.loadByEmail(email);
    let thisStaff = await staffRepo.getStaffById(id);
    const phone = req.body.phone;
    let phoneDB = await staffRepo.loadByPhone(phone);
    console.log(id);
    console.log(name);
    console.log(email);
    console.log(phone);

    if ((emailDB.length > 0 && email !== thisStaff[0].email) || (phoneDB.length > 0 && phone !== thisStaff[0].phone)) {
        if (phoneDB.length > 0 && phone !== thisStaff[0].phone) {
            res.statusCode = 204;
            res.json({
            message: "This phone does already exists"
            });
        } else if (emailDB.length > 0 && email !== thisStaff[0].email) {
            res.statusCode = 202;
            res.json({
            message: "This email does already exists"
            });
        }
    }
    else {
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
    }
});



module.exports = router;
