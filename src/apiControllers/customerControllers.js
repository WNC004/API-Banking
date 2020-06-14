var express = require("express");
var customerRepo = require("../repos/customerRepo");
const jwt = require('jsonwebtoken');
const moment = require('moment');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const cryptoJS = require('crypto-js')
var _ = require("lodash");

const config = require('../config/default.json');
const verifyConnect = require('../middlewares/verifyConnect.mdw');
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

router.get("connect-bank/:userId", verifyConnect ,async (req,res) => {
  const results = await customerRepo.singleByUserID(req.body.userID);

  delete results.password_hash;

  res.json(results);
});

module.exports = router;
