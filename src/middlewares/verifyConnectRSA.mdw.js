const createError = require('http-errors');
const moment = require('moment');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const cryptoJS = require('crypto-js')
const config = require('../config/default.json');

module.exports = function(req, res, next) {
    const headerTs = req.headers['ts'];
    
    var data = headerTs + JSON.stringify(req.body);
    
    var signature = cryptoJS.HmacSHA256(data, config.bankingAuth.secret).toString();

    console.log(signature); 

    if(signature !== req.headers['sign']){
        throw createError(400, 'Signature is wrong!');
    }

    if(req.headers['partner-code'] !== config.bankingAuth.partnerKey){
        throw createError(400, 'Invalid partner code!');
    }

    console.log(moment().unix());

    const ts = moment().unix();
    const timeExp = moment.unix(headerTs).add(10, 'm').unix();

    console.log(timeExp);

    if(ts > timeExp){
        console.log(moment().unix());
        throw createError(400, 'Request expire!');
    }

    next();
}