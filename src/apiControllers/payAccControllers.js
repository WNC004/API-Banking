var express = require("express");
var shortid = require("shortid");
var moment = require("moment");
var _ = require("lodash");
var { PAY_ACC_STATUS_OPEN, PAY_ACC_STATUS_CLOSED } = require("../fn/constant");

var payAccRepo = require("../repos/payAccRepo");

var router = express.Router();

router.get("/pay-accs", (req, res) => {
  payAccRepo
    .loadAll()
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

router.get("/pay-accs/:customerId", (req, res) => {
  const { customerId } = req.params;

  payAccRepo
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


router.post("/pay-acc", (req, res) => {
  const _payAcc = req.body;
  _payAcc.id = shortid.generate();
  _payAcc.createdAt = moment().format("YYYY-MM-DD HH:mm");
  // số dư mặc định là  0
  _payAcc.balance = 0;
  // trạng thái mặc định là OPEN
  _payAcc.status = PAY_ACC_STATUS_OPEN;
  // số tài khoản gồm 8 chữ số
  _payAcc.accNumber = require("rand-token")
    .generator({
      chars: "numeric"
    })
    .generate(8);

  payAccRepo
    .add(_payAcc)
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

router.patch("/pay-acc/balance", (req, res) => {
  const payAccId = req.body.payAccId;
  // newBalance = số dư cũ + tiền cần nạp;
  const newBalance = req.body.newBalance;

  const payAccEntity = {
    payAccId,
    newBalance
  }

  payAccRepo
    .UpdateBalanceById(payAccEntity)
    .then(result => {
      console.log(result);
      res.statusCode = 201;
      res.json({
        status: "OK"
      });
    })
    .catch(err => {
      console.log(err);
      res.statusCode = 500;
      res.end("View error log on console");
    });
});


router.get("/pay-acc/:accNumber", (req, res) => {
  const { accNumber } = req.params;
  payAccRepo
    .loadByAccNumber(accNumber)
    .then(rows => {
      res.statusCode = 200;
      res.json(rows);
    })
    .catch(err => {
      console.log(err);
      res.statusCode = 500;
      res.end("View error log on console");
    });
});

router.get("/pay-accs/status/open", (req, res) => {
  payAccRepo
    .loadByOpen(PAY_ACC_STATUS_OPEN)
    .then(rows => {
      res.statusCode = 200;
      // console.log(rows.length);
      res.json({
        "number_of_open": rows.length,
        rows
      });
    })
    .catch(err => {
      console.log(err);
      res.statusCode = 500;
      res.end("View error log on console");
    });
});

router.patch("/pay-acc/status/closed", (req, res) => {
  const payAccId = req.body.payAccId;
  const newStatus = PAY_ACC_STATUS_CLOSED;
  const newBalance = '0';

  const payAccEntity = {
    payAccId,
    newStatus,
    newBalance
  }

  payAccRepo
    .UpdateStatusById(payAccEntity)
    .then(result => {
      console.log(result);
      res.statusCode = 201;
      res.json({
        status: "OK"
      });
    })
    .catch(err => {
      console.log(err);
      res.statusCode = 500;
      res.end("View error log on console");
    });
});

module.exports = router;
