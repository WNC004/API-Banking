const express = require('express');
const userModel = require('../models/user.model');

const router = express.Router();

// const verify = require('../middlewares/auth.mdw');
const verifyAcc = require('../middlewares/acc.mdw');
const verifyPGPTransfer = require('../middlewares/pgp-transfer.mdw');


// router.get('/', verifyAcc ,async (req,res) => {

//     const results = await userModel.singleByUserID(req.body.userID);

//     delete results.password_hash;


//     res.json(results);
// })

router.get('/', verifyPGPTransfer , async (req,res) => {

    const results = await userModel.singleByUserID(req.body.userID);

    delete results.password_hash;


    res.json(results);
})



// router.get('/', verify ,async (req,res) => {
//     const results = await userModel.singleByUserID(req.body.userID);

//     delete results.password_hash;

//     res.json(results);
// })

// router.post('/', async (req, res) => {
//     const result = await userModel.add(req.body);
//     const ret = {
//         id: result.insertId,
//         ...req.body
//     }

//     delete ret.password_hash;
    
//     res.status(201).json(ret);
// })

module.exports = router;