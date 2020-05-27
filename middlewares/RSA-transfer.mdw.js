const createError = require('http-errors');
const moment = require('moment');
const nodeRSA = require('node-rsa');
const crypto = require('crypto');
const config = require('../config/default.json');

module.exports = function(req, res, next) {
    const headerTs = req.headers['ts'];
    const data = headerTs + JSON.stringify(req.body);

    privateKeyB = config.RSA.privateKeyB;
    publicKeyB = config.RSA.publicKeyB;

    const sign = crypto.createSign('SHA256');
    
    sign.write(data);
    const signature = sign.sign(privateKeyB, 'hex'); 

    console.log(signature);

    const verify = crypto.createVerify('SHA256');
    verify.write(data);
    verify.end();
    
    if(!verify.verify(publicKeyB, req.headers['sign'], 'hex')){ 
        throw createError(400, 'Signature is wrong!');
    }

    if(req.headers['partner-code'] !== config.interbank.partnerCode){
        throw createError(400, 'Invalid partner code!');
    }

    console.log(moment().unix());

    const ts = moment().unix();
    const timeExp = moment.unix(headerTs).add(10, 'm').unix();

    if(ts > timeExp){
        console.log(moment().unix());
        throw createError(400, 'Request expire!');
    }

    next();
}