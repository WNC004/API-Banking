var express = require("express");
var payAccRepo = require("../repos/payAccRepo");
var historyRepo = require("../repos/historyRepo");

var openpgp = require('openpgp'); // use as CommonJS, AMD, ES6 module or via window.openpgp

openpgp.initWorker({
    path: 'openpgp.worker.js'
}) // set the relative web worker path

openpgp.config.aead_protect = true
const jwt = require('jsonwebtoken');
const moment = require('moment');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const cryptoJS = require('crypto-js')
var _ = require("lodash");

const config = require('../config/default.json');
var verifyRSABank = require('../middlewares/verifyConnectRSA.mdw');
var verifyPGPTransfer = require('../middlewares/verifyPGPTransfer.mdw');
var verifyPGPBank = require('../middlewares/verifyConnectPGP.mdw');
var verifyRSATransfer = require('../middlewares/verifyRSATransfer.mdw');


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

const passphrase = 'thanhtri';


var router = express.Router();

router.post("/RSABank/users", verifyRSABank , async (req,res) => {
    // const results = await customerRepo.getCustomerById(req.body.userID);
    const results = await payAccRepo.loadConnectByAccNumber(req.body.accountID);

    console.log(results);

    res.json(results);

});

router.post("/PGPBank/users", verifyPGPBank, async (req, res) => {
    await payAccRepo.loadConnectByAccNumber(req.body.accountID).then(
        result => {
            console.log(result[0]);
            res.statusCode = 201;
            res.send(result[0]);
        }
    );
})


router.post("/PGPTransfer", verifyPGPTransfer , async (req,res) => {

    // const {accNumber, newBalance, message, senderName,senderNumber} = req.body;
    
    const {
        accNumber,
        newBalance,
        message,
        senderName,
        senderNumber
    } = req.body;

    // const payAccEntity = {
    // accNumber,
    // newBalance,
    // message,
    // senderName,
    // senderNumber
    // }

    historyRepo
    .addConnectPGP(req.body)
    .then( async(result) => {
        console.log(result);
        res.statusCode = 201;

        let dataRS = {success: true, name: "nguyen thanh tri"};

        const { keys: [privateKey] } = await openpgp.key.readArmored(privateKeyArmored);
        await privateKey.decrypt(passphrase);
        const { data: cleartext } = await openpgp.sign({
            message: openpgp.cleartext.fromText(JSON.stringify(dataRS)), // CleartextMessage or Message object
            privateKeys: [privateKey]                         // for signing
        });

        console.log(cleartext);        
        res.send({
            cleartext
        });
    })
    .catch(async(err) => {
        console.log(err);
        res.statusCode = 500;
        let dataRS = {success: false};

        const { keys: [privateKey] } = await openpgp.key.readArmored(privateKeyArmored);
        await privateKey.decrypt(passphrase);
        const { data: cleartext } = await openpgp.sign({
            message: openpgp.cleartext.fromText(JSON.stringify(dataRS)), // CleartextMessage or Message object
            privateKeys: [privateKey]                         // for signing
        });

        console.log(cleartext);        
        res.send({
            cleartext
        });
    });
});

router.post("/RSATransfer", verifyRSATransfer , async (req,res) => {
    // const results = await payAccRepo.UpdateBalanceByAccNumber(req.body.accountID, req.body.newBalance);
    const accNumber = req.body.accountID;
    // newBalance = số dư cũ + tiền cần nạp;
    const newBalance = req.body.newBalance;
    // msg = lời nhắn
    const message = req.body.msg;

    const payAccEntity = {
    accNumber,
    newBalance
    }

    payAccRepo
    .UpdateBalanceByAccNumber(payAccEntity)
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

