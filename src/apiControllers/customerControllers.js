var express = require("express");
var customerRepo = require("../repos/customerRepo");
const jwt = require('jsonwebtoken');
const moment = require('moment');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const cryptoJS = require('crypto-js')
var _ = require("lodash");

const config = require('../config/default.json');
var router = express.Router();

router.get("/customers", (req, res) => {
  customerRepo
    .getCustomers()
    .then(rows => {
      res.statusCode = 200;
      // res.json(rows);
      res.send(
        _.sortBy(JSON.parse(JSON.stringify(rows)), [
          function(o) {
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

// router.get("/histories/:payAccId", (req, res) => {
//   const { payAccId } = req.params;

//   historyRepo
//       .loadByPayAccId(payAccId)
//       .then(rows => {
//           res.statusCode = 200;
//           // res.json(rows);
//           res.send(
//               _.sortBy(JSON.parse(JSON.stringify(rows)), [
//                   function (o) {
//                       return o.createdAt;
//                   }
//               ]).reverse()
//           );
//       })
//       .catch(err => {
//           console.log(err);
//           res.statusCode = 500;
//           res.end("View error log on console");
//       });
// });

router.post("/customer/change-password", (req, res) => {
  var newPassword = req.body.newPassword;
  var id = req.body.id;
  customerRepo
    .changePassword(newPassword, id)
    .then(value => {
      console.log(value);
      res.statusCode = 201;
      res.json(req.body);
    })
    .catch(err => {
      console.log(err);
      res.statusCode = 500;
      res.end(
        "View error log on console. Maybe Duplicate email for key f_email_UNIQUE"
      );
    });
});

module.exports = router;
