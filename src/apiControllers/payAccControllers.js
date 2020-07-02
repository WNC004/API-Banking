var express = require("express");
var shortid = require("shortid");
var moment = require("moment");
var _ = require("lodash");
var { PAY_ACC_STATUS_OPEN, PAY_ACC_STATUS_CLOSED } = require("../fn/constant");
var axios = require("axios");
const crypto = require("crypto");
var md5 = require("md5");

var payAccRepo = require("../repos/payAccRepo");
const { message } = require("openpgp");

var router = express.Router();

// const privateKeyRSA  = "-----BEGIN RSA PRIVATE KEY-----\nMIICXQIBAAKBgQCxMoKXFch5dEeTcnMQUDwiIMyMlZGC4f6AsONDIWNIkGqSzkui\nz7SlueYKb6DiYryxv1j98ksn1JaBnNteQZRZpgd41BaED/n34U6+wu8A1fN7UzTn\nxvW+1qxOoOtC984f1Vpolz3bqDXeuTpa9AcTVVOUWYNgCBfWm2qS6lXPoQIDAQAB\nAoGAHrTvFnmK5Sk2YiHaOMB+uzdN2yrsLW82aFy+9Voq119XaJthVhSCbJm7eKGB\nktmjc3YCWPeM+JkJf+qLxVi9+UUjXAc4BxZqGISD2p/aMKwV1KjlEhDnTPsezn3b\nY1wOBhBQUy4Js+/LPhPO5p2/sDe4OARo83YvxRyErMk+Z/UCQQDkH2NO4OctvHju\n0wPh27sRA5N+f3OXIicFUbzhekzopKuXk9CjVgfIT6BRNo5ln3Y7w9uBC/MIFYzT\npeJng44nAkEAxtn4NCw0zR1xoldSp81n2Ga/lByl742sRpKXxh27+7NEoHPEJdY/\nAGZTWI1V7hXKPZhLKyu2gPBty2y/4swY9wJBAKyu/fPV1+oNQ9Y1sjikpsTIWjxl\nqlB7r+Ic78gXVmS9Uo9Ze5RJKXb+n7Mag0x2G4A+UMktDHnQJlyItAv7z/0CQQCn\nyl0JiRO00FeGaLCyLzyk+W5GiDXsgVsQ4bl3zrdEl+wciBLG6pWWvMEvQ3Nyxqg0\neUFUWDpTaoz6zfTMZvPZAkBIqHt9wF1SQPzTU22O/jrT3MR6md/OhSyQ0Tlg7mxo\nrnorLnEjZLRLHI1HIxAqVbGyEMvsHBVG7kBrScwkO6rS\n-----END RSA PRIVATE KEY-----";
const privateKeyRSA= "-----BEGIN RSA PRIVATE KEY-----\nMIICXQIBAAKBgQCxMoKXFch5dEeTcnMQUDwiIMyMlZGC4f6AsONDIWNIkGqSzkui\nz7SlueYKb6DiYryxv1j98ksn1JaBnNteQZRZpgd41BaED/n34U6+wu8A1fN7UzTn\nxvW+1qxOoOtC984f1Vpolz3bqDXeuTpa9AcTVVOUWYNgCBfWm2qS6lXPoQIDAQAB\nAoGAHrTvFnmK5Sk2YiHaOMB+uzdN2yrsLW82aFy+9Voq119XaJthVhSCbJm7eKGB\nktmjc3YCWPeM+JkJf+qLxVi9+UUjXAc4BxZqGISD2p/aMKwV1KjlEhDnTPsezn3b\nY1wOBhBQUy4Js+/LPhPO5p2/sDe4OARo83YvxRyErMk+Z/UCQQDkH2NO4OctvHju\n0wPh27sRA5N+f3OXIicFUbzhekzopKuXk9CjVgfIT6BRNo5ln3Y7w9uBC/MIFYzT\npeJng44nAkEAxtn4NCw0zR1xoldSp81n2Ga/lByl742sRpKXxh27+7NEoHPEJdY/\nAGZTWI1V7hXKPZhLKyu2gPBty2y/4swY9wJBAKyu/fPV1+oNQ9Y1sjikpsTIWjxl\nqlB7r+Ic78gXVmS9Uo9Ze5RJKXb+n7Mag0x2G4A+UMktDHnQJlyItAv7z/0CQQCn\nyl0JiRO00FeGaLCyLzyk+W5GiDXsgVsQ4bl3zrdEl+wciBLG6pWWvMEvQ3Nyxqg0\neUFUWDpTaoz6zfTMZvPZAkBIqHt9wF1SQPzTU22O/jrT3MR6md/OhSyQ0Tlg7mxo\nrnorLnEjZLRLHI1HIxAqVbGyEMvsHBVG7kBrScwkO6rS\n-----END RSA PRIVATE KEY-----";
router.post("/pay-acc/PGP/user", (req, res) => {
  const cardNumber = req.body.card_number;

  var ts = moment().unix();

  var signature = md5({stk: +cardNumber} + ts + "secretKey");
  console.log(signature);

  axios.post(
      `https://dacc-internet-banking.herokuapp.com/bank/getCustomer`,
    {
      stk: cardNumber
    },
    {
      headers: {
        "ts": ts,
        "company_id": "pawGDX1Ddu",
        "sig": signature
      }
    })
    .then(result => {
              console.log(result.data);
              res.statusCode = 201;
              res.json(result.data);
            })
    .catch(err => {
              console.log(err);
              res.statusCode = 500;
              res.end("View error log on console");
            })
    }
);

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
    .loadPaymentByCustomerId(customerId)
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

router.get("/pay-accs-all/:customerId", (req, res) => {
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

router.post("/pay-acc/saving", (req, res) => {
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
  _payAcc.Type = '2'; 
  payAccRepo
    .addSavingAcc(_payAcc)
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

router.patch("/pay-acc/RSA/balance", (req, res) => {
  const senderCardNumber = req.body.senderCard;
  const payAccId = req.body.payAccId;
  // newBalance = số dư cũ + tiền cần nạp;
  const newBalance = req.body.newBalance;
  // message to rsa bank 
  const message = req.body.message;
  const receiveCardNumber = req.body.receiveCard;
  const updateBalance = req.body.updateBalance;

  var ts = moment().unix();
  console.log(ts);

  const dataRSA = ts + JSON.stringify({ 
    card_number: receiveCardNumber,
    money: newBalance,
    message: message
  });

  const sign = crypto.createSign('SHA256');
  sign.write(dataRSA); // đưa data cần kí vào đây
  const signature = sign.sign(privateKeyRSA, 'hex'); // tạo chữ kí bằng private key
  console.log(signature);

  axios.post(
    `https://internet-banking-api-17.herokuapp.com/api/transfer-money`,
    {
      card_number: +receiveCardNumber,
      money: +newBalance,
      message: message
    },
    {
      headers: {
        "ts": ts,
        "partner_code": 2,
        "sign": signature,
        "card_number_sender": +senderCardNumber
      }
    }
  )
  .then(
    // axios.spread(
    //   (
    //     updateReceiverPayAcc,
    //   ) => {
    //     if (
    //       updateReceiverPayAcc.status !== 201 
    //     ) {
    //       console.log(err);
    //       throw new Error(
    //         "Something went wrong operating transaction, status ",
    //       );
    //     }   
    //     else{
    //       console.log("Done transfer");
    //     }   
    //   })
    result => {
      console.log(result);
      console.log("Done transfer");
      res.statusCode = 201;
      res.json({
        status: "OK"
      });}
  )
  .catch(err => {
    console.log(err);
    console.log("Fail getting receiver details");
  });


  const payAccEntity = {
    payAccId,
    updateBalance
  }

  payAccRepo
    .UpdateConnectBalanceById(payAccEntity)
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

router.post("/check-balance", (req, res) => {
  const { customerId, amount } = req.body;
  payAccRepo
    .checkPaymentAccByCustomerId(customerId, '1')
    .then(rows => {
      res.statusCode = 200;
      var sum = 0;
      if (rows.length > 0) {
        sum = rows[0].balance;
      }
      if(parseInt(sum)>=parseInt(amount)+10000){
        res.json({
          key: "OK",
          message: "Enough amount"
        })
      }
      else{
        res.json({
          key: "Failed",
          message: "Not enough amount"
        })
      }
    })
    .catch(err => {
      console.log(err);
      res.statusCode = 500;
      res.end("View error log on console");
    });
});

router.post("/pay-acc/banks", (req, res) => {
  payAccRepo
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
