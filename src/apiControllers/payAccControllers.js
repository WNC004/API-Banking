var express = require("express");
var shortid = require("shortid");
var moment = require("moment");
var _ = require("lodash");
var { PAY_ACC_STATUS_OPEN, PAY_ACC_STATUS_CLOSED } = require("../fn/constant");
var axios = require("axios");
const crypto = require("crypto");
var md5 = require("md5");

var payAccRepo = require("../repos/payAccRepo");
var openpgp = require('openpgp'); // use as CommonJS, AMD, ES6 module or via window.openpgp

openpgp.initWorker({
    path: 'openpgp.worker.js'
}) // set the relative web worker path

openpgp.config.aead_protect = true

const { message } = require("openpgp");

var router = express.Router();

const passphrase = 'thanhtri';

const privateKeyRSA = `-----BEGIN RSA PRIVATE KEY-----
MIICXAIBAAKBgQCTRTan89kLFCdjF3jI3OrROIGSPzU11INmuwTkL64C611dQ5IW
duNpzAZgjFqIv3HT1wHcc2rE4Ts8C08vjwOxkQRqQtKXtPHb2ddDZIxKZ1s1/RhD
85xfYYl+gXRNng1OxnYHlfEJ5NLA0T7LbhFpyrBLyQif2+ctT6LYN24ibwIDAQAB
AoGARl51Hk2LMRsBMv0dLsU4wp4Ac7QWJdGUs/q6/Jm3yRdTtmO6I1fNlFjz1yBZ
hiwMJNAAyKixpL+GgUtaG/x3I58TrAVKYn0ld43dOnNVSaY6PI+tTTLuwo26yZyD
LqgRrzcDaVWXVNk9oNHlNm+qGajarFZsHfDUF3znINuVzqkCQQDgEEt4ruhDs3Ae
gciVhySEBezIHcyz5VzF6uExMr2OT6dnNuJhlu9w48jSUNV85k1tMSjG7xel9N4V
MRefc82LAkEAqELcbOAvqa8yhTvKk2CicCPk9SpdN8C1vhlTmvPmHhwUsuFCxgAc
AF4qHuCNDtCR8DoW06EchZ6pDAm8UgsjLQJBAMNi0j1J4LZwufuQVxa1Q01xUTps
af4Rq2XXXUomog+APE2QGbbaBLBfodZssM36klf+fz2Cbw/DyQmXxq7AL+MCQHsJ
OQlb/T5E39pQ2FZgCSea96bWLYfBIKQ6/MmHozNNMU2ELkF+fvs93+roI/07Qhu5
PkvNuX9zfwVQcSZFApkCQC78uNmjNkFSVR75EFASVdda4wqbIayfHtdNTW3e6f5Y
ZoKJDhvfReoxzvA8bsBNs6TuYsvnGIMsNMxgu1IivxY=
-----END RSA PRIVATE KEY-----`;


const privateKeyArmored = `-----BEGIN PGP PRIVATE KEY BLOCK-----
Version: Keybase OpenPGP v1.0.0
Comment: https://keybase.io/crypto

xcASBF7EBOkTBSuBBAAiAwMEhHUQtUWpYwuQjohrUEFroqaBA1G1zTz1nVu6s0iM
xgVO/YKeUopqBRM8eYNXdcNqAUwkAljNedWMtXoP3N+HXbTpWjCqjCN07I2KwRVd
hNOoHb92CcZ9ZWAQejAUo/9r/gkDCOZzj/GsgVDqYOmSJem1wHFrOGbFylQOHblZ
YAK4JiL7pGyiRfTuUj1NL7d+VJHDx5z//SnNcZWwyU6E9qpaGifCWdwhC5RdE6C0
R1xBNV5XVsTrnt8OhCg565Zl9VbhzR10cmkgKG5vbmUpIDx0cmkxMjNAZ21haWwu
Y29tPsKPBBMTCgAXBQJexATpAhsvAwsJBwMVCggCHgECF4AACgkQPm/RXY2u3BUi
dQF/ZApdsE3WIMdvasptRbyCAHjkH7ASuMgXzFnvv8Xsnxy3OI+agNH7/opDa0g3
T6E2AYCnaFjJINtmRuzPkc33J+TUwRgeBrqGc9hr4latKDg9IUuWw/ZkbmXQWc2/
1N1pGzvHpQRexATpEwgqhkjOPQMBBwIDBDxrGcbc/86pDt5OtuqkAT3aVsB0/4sk
W+TSfq9w6WaRuF5ruRujPe26PMb4cEeZeigtMAJBwvcJTviInw+kg5j+CQMIVj2l
6BfYykZglGOQMRSQkXCcBmMHpuSFAQXN5gKqLHxa/nLEtIMtZjEbc4NQ7v0PCNmS
+VAhbP1eXlmFH8c7szbfQ5MMVjLuceWiYy7I2MLAJwQYEwoADwUCXsQE6QUJDwmc
AAIbLgBqCRA+b9Fdja7cFV8gBBkTCgAGBQJexATpAAoJELkvk8MRq0hIbrgA/RWE
e6tt2EU+KYCTHmcjoMegpwSprChlr4Rhb5Pb4mIdAP9SUusoE/Mylge6LzsJlxzc
Zbmq05VEY9f/7FXvot01JXnPAX4rXrUImAxSPRZP4mu67U43H89k+nWttMBWpAUO
V9Qbnd78I6l04bi6wXxFw9jLRIsBfRiWN8NW21Ra8xzgeM/FqRHW1jJvnMRbQ5pg
q89Z25U/eY9OZgFArIYzUb7/O7kn2celBF7EBOkTCCqGSM49AwEHAgMEn4cryDH7
kE4ClyYdwSeiyqveD7r6OjkWyXK+xsZxdX81r5sY+m0ibbxzU4m88BOURtrXbT31
/L2CRh6o6LcZO/4JAwi4lr49VkHc1WBUpl5Aws0/UPSeWqvr8H/zLuZXUn8fjxL1
iujjHntNh+wW9jCgE2pRMLPz6pIY7DpLmJs4gW9btLU6KcMV22PPNK70kmc2wsAn
BBgTCgAPBQJexATpBQkPCZwAAhsuAGoJED5v0V2NrtwVXyAEGRMKAAYFAl7EBOkA
CgkQb3x/wP1uVs9avQD/S/Bh3SMzxFf0SGoX3n2y7FhrJq77gg7TC7dYpMfXpjsB
AP3+RQ0cnCloYenJzJys/8flT6JE5FjoFKWepQvpv7wdv8kBgLvQw3iWNW4yXlRc
gBWQT5YdC2MeLwP/Z0TA2IouqQLngZ+1cS+ThYNHSDRvb++B0gF7BqpvvcWpt27/
UxcvKZkktTueiLokXuWxIC5Fe9+TwIb4CzrRdfY6vKgh6iJtZqXv
=bm/2
-----END PGP PRIVATE KEY BLOCK-----
`;

// get pgp acc information

router.post("/pay-acc/PGP/user", (req, res) => {
  const cardNumber = req.body.card_number;

  var ts = Date.now();

  var signature = md5({stk: +cardNumber} + ts + 'secretKey');
  console.log(signature);
  // stk pgp: 4485052950176732
  axios.post(
      `https://dacc-internet-banking.herokuapp.com/bank/getCustomer`,
    {
      stk: +cardNumber
    },
    {
      headers: {
        "ts": ts,
        "company_id": 2,
        "sig": signature
      }
    })
    .then(result => {
              
              console.log(result);
              res.statusCode = 201;
              let name = result.data.data.name;
              let email = result.data.data.email;
              let phone = ' ';
        
              let data = {
                full_name: name,
                email: email,
                phone_number: phone
              }
              console.log(data);
          
              res.send(data);
            })
    .catch(err => {
              console.log(err);
              res.statusCode = 500;
              res.end("View error log on console");
            })
    }
);

// pgp transfer money

router.patch("/pay-acc/PGP/balance", async (req, res) => {
  const senderCardNumber = req.body.senderCard;
  const payAccId = req.body.payAccId;
  // newBalance = tiền cần nạp +- tiền phí;
  const newBalance = req.body.newBalance;
  // message to rsa bank 
  const message = req.body.message;
  const receiveCardNumber = req.body.receiveCard;
  const updateBalance = req.body.updateBalance;

  var ts = Date.now();
  console.log(ts);
  console.log(payAccId);
  var senderName = "";

  await payAccRepo.loadCustomerNameById(payAccId).then(
    name => {
      console.log(name);
      senderName = name[0].name;
      console.log(senderName);
    }
  )

  const dataPGP = { 
    accountRequest: +senderCardNumber,
    nameRequest: senderName,
    message: message,
    stk: +receiveCardNumber,
    amountOfMoney: +newBalance
  };

  /// ky bdx 
    const { keys: [privateKey] } = await openpgp.key.readArmored(privateKeyArmored);
    await privateKey.decrypt(passphrase);
    const { data: cleartext } = await openpgp.sign({
        message: openpgp.cleartext.fromText(JSON.stringify(dataPGP)), // CleartextMessage or Message object
        privateKeys: [privateKey]                         // for signing
    });
    console.log(cleartext);

    var signature = md5({cleartext} + ts + 'secretKey');
    console.log(signature);

  const payAccEntity = {
    payAccId,
    updateBalance
  }


  axios.post(
    `https://dacc-internet-banking.herokuapp.com/bank/pgpTransferMoney`,
    {
      cleartext
    },
    {
      headers: {
        "ts": ts,
        "company_id": 2,
        "sig": signature
      }
    }
  )
  .then(
    result => {
      console.log(result.data);
      console.log(result.data.cleartext);
      let cleartext = result.data.cleartext;
      let dataObj = cleartext.slice(
        cleartext.indexOf('{'),
        cleartext.indexOf('}') + 1
      );
      let data = JSON.parse(dataObj);
      console.log(data);
      console.log("Done verify");
      if(data.success === true)
      {
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
      }
    }

  )
  .catch(err => {
    console.log(err);
    console.log("Fail getting receiver details");
    state = 0;
  });

});

// RSA transfer money 
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
    card_number: +receiveCardNumber,
    money: +newBalance,
    message: message
  });

  const payAccEntity = {
    payAccId,
    updateBalance
  }


  const sign = crypto.createSign('SHA256');
  sign.write(dataRSA); // đưa data cần kí vào đây
  // Dùng cái này để verify giao dịch
  var signatureRSA = sign.sign(privateKeyRSA, 'hex'); // tạo chữ kí bằng private key
  console.log(signatureRSA);

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
        "sign": signatureRSA,
        "card_number_sender": +senderCardNumber
      }
    }
  )
  .then(
    result => {
      console.log(result.data.status);
      console.log("Done transfer");
      if(result.data.status === "success!")
      {
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
      }
    }

  )
  .catch(err => {
    console.log(err);
    console.log("Fail getting receiver details");
    state = 0;
  });

});

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
