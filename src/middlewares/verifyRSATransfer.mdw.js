const createError = require('http-errors');
const moment = require('moment');
const crypto = require('crypto');
const config = require('../config/default.json');
const cryptoJS = require('crypto-js');
var openpgp = require('openpgp'); // use as CommonJS, AMD, ES6 module or via window.openpgp

openpgp.initWorker({
    path: 'openpgp.worker.js'
}) // set the relative web worker path

openpgp.config.aead_protect = true

// const privKey = privateKeyArmored; 
const publicKeyArmored = `-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: Keybase OpenPGP v1.0.0
Comment: https://keybase.io/crypto

xm8EXsQE6RMFK4EEACIDAwSEdRC1RaljC5COiGtQQWuipoEDUbXNPPWdW7qzSIzG
BU79gp5SimoFEzx5g1d1w2oBTCQCWM151Yy1eg/c34ddtOlaMKqMI3TsjYrBFV2E
06gdv3YJxn1lYBB6MBSj/2vNHXRyaSAobm9uZSkgPHRyaTEyM0BnbWFpbC5jb20+
wo8EExMKABcFAl7EBOkCGy8DCwkHAxUKCAIeAQIXgAAKCRA+b9Fdja7cFSJ1AX9k
Cl2wTdYgx29qym1FvIIAeOQfsBK4yBfMWe+/xeyfHLc4j5qA0fv+ikNrSDdPoTYB
gKdoWMkg22ZG7M+Rzfcn5NTBGB4GuoZz2GviVq0oOD0hS5bD9mRuZdBZzb/U3Wkb
O85SBF7EBOkTCCqGSM49AwEHAgMEPGsZxtz/zqkO3k626qQBPdpWwHT/iyRb5NJ+
r3DpZpG4Xmu5G6M97bo8xvhwR5l6KC0wAkHC9wlO+IifD6SDmMLAJwQYEwoADwUC
XsQE6QUJDwmcAAIbLgBqCRA+b9Fdja7cFV8gBBkTCgAGBQJexATpAAoJELkvk8MR
q0hIbrgA/RWEe6tt2EU+KYCTHmcjoMegpwSprChlr4Rhb5Pb4mIdAP9SUusoE/My
lge6LzsJlxzcZbmq05VEY9f/7FXvot01JXnPAX4rXrUImAxSPRZP4mu67U43H89k
+nWttMBWpAUOV9Qbnd78I6l04bi6wXxFw9jLRIsBfRiWN8NW21Ra8xzgeM/FqRHW
1jJvnMRbQ5pgq89Z25U/eY9OZgFArIYzUb7/O7kn2c5SBF7EBOkTCCqGSM49AwEH
AgMEn4cryDH7kE4ClyYdwSeiyqveD7r6OjkWyXK+xsZxdX81r5sY+m0ibbxzU4m8
8BOURtrXbT31/L2CRh6o6LcZO8LAJwQYEwoADwUCXsQE6QUJDwmcAAIbLgBqCRA+
b9Fdja7cFV8gBBkTCgAGBQJexATpAAoJEG98f8D9blbPWr0A/0vwYd0jM8RX9Ehq
F959suxYayau+4IO0wu3WKTH16Y7AQD9/kUNHJwpaGHpycycrP/H5U+iRORY6BSl
nqUL6b+8Hb/JAYC70MN4ljVuMl5UXIAVkE+WHQtjHi8D/2dEwNiKLqkC54GftXEv
k4WDR0g0b2/vgdIBewaqb73Fqbdu/1MXLymZJLU7noi6JF7lsSAuRXvfk8CG+As6
0XX2OryoIeoibWal7w==
=wLGQ
-----END PGP PUBLIC KEY BLOCK-----
`;

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

const PUBLIC_KEY = `-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: Keybase OpenPGP v1.0.0
Comment: https://keybase.io/crypto

xo0EXvtQawEEANSErn0DQrRryWljARkg7aJEL7E7miN18oldU/9rOHK64okBPi7w
FS6uI7pK9SXzJHRF06oII3sNrm3ZkX865Y6dybOcfJHHQ7JUut/1MaqnwXoH1Uhb
gbLJUEwGHHFzvvSg22OpwnALKAvDCsAvL1AeRbHWPgqveNnHJX2pVFGjABEBAAHN
QVRyYW4gTmd1eWVuIE5nb2MgVHJ1b25nIChQR1Aga2V5ICkgPDE2MTI3NTlAc3R1
ZGVudC5oY211cy5lZHUudm4+wq0EEwEKABcFAl77UGsCGy8DCwkHAxUKCAIeAQIX
gAAKCRCDJz1aqNEFhVp2A/9jKhXKvoxCpZ5FEVqfNfIh7EnypMaXApsi7skkvhE/
di+9n/aaELCbsVGmqqed73EhRX5LltVceq055Ranewy2L02F8yQRDDabFwdYTahI
EMEXGDv8OnQ54PqrW82eRfoFubdnECwNPc57y+v1t7zp3ouTlXRch7QL0Fht4gz6
Bs6NBF77UGsBBAC5Pimxeg9hZrQZIperGEV4jl1DVpu+UPLtTz9z7Q8f4YxVSIUm
mxSSgiSYqJq3o8mFtzKFxvPEGpEq1oXsapYQLIlC/+QUOP3i6UMJlPTnVSFd9ioR
G894FzSbn6Mne6mXLjmy+lvsAjSuSI/U/gKq9MfVB16Ra3FyRgBC5NMj4QARAQAB
wsCDBBgBCgAPBQJe+1BrBQkPCZwAAhsuAKgJEIMnPVqo0QWFnSAEGQEKAAYFAl77
UGsACgkQsdlN7uRTLSmiHQQApzdjc/f0TvkeyxhU7Lu7h7XrhXTwYtk60Efeus/+
vu2vkyG1Fg73fPdA2jqY8fOXs+98rBNHQAc2qTOPRFbXDBjQdWcf2Lp1HEiDQMU1
1gzAjFejMPyh5chv1w+0+ZeuShHHjZgxyi7lqf4NxMwhJK1heC3blYX9j2xj37By
E8CY2gP+MRTlsXHzCFQ7UdExdgFO8dUrQFp6fOmCAzyX5vScDSqBuW3ZiC8SkiqE
XQ9lU+YmKuoaxnMRei+oMBKb9tFuNCq41OST2bPVvaFIjQUdMzpBtWcacslmNzJR
+AMi2CU1TRxRoEClJ/Hlb2bRy8QdWraApsEtqYM9ct86Qqv4t9nOjQRe+1BrAQQA
u22PfdQR6PHHJX/TkI9nJYqncwB+9vD6szDPO0h0z7vVvquvnvaraaosnwBLMPj0
7E+aUX4TY7CM00qXHxehFjcc+n4RJ/3wSSxgtHMtjc43RYZkNSrfs4ffCkrCKiCa
49yH+NMAjp/CO+1aMYTpaybOGzlic+q2Vo9ZwpUYjv0AEQEAAcLAgwQYAQoADwUC
XvtQawUJDwmcAAIbLgCoCRCDJz1aqNEFhZ0gBBkBCgAGBQJe+1BrAAoJEBhktTWQ
qhGk9nwEAJ6P6Ao/9dtAXyYoNfid348OVjjqjCV/6h5ICKbFiTDTzKbww2h5psNd
2O/LP3VvcLafgQhepxw/WU/ilLiAvR4UcIP1b48iy1aFZQtSggWg3PtUsT1Ers7C
QsPO2SHjQGttIA5jtyodbNwnKyhh5OdpMj7BB6NXWOZ7SfkB85hz08YEALCtVlvV
ivE1Ld9p8RhbzgtpcLqZot5GLU1MtXuSOvGwoqfNIrIVRoUksLkSub1RWRrEJ6VJ
/owugdG38HawyPtKc/4bdrA6SY19k0lk97CPt7STcTQtCFsbdfZaI9u0x7c7cDNZ
ptXWd0TFh/edR345p5gs+6dlelo6Y690vSCo
=EMzc
-----END PGP PUBLIC KEY BLOCK-----
`;

const passphrase = 'thanhtri';


module.exports = async function(req, res, next) {
    const headerTs = req.headers['ts'];
    var data = headerTs + req.body;

    // const { keys: [privateKey] } = await openpgp.key.readArmored(privateKeyArmored);
    // await privateKey.decrypt(passphrase);
    // const { data: cleartext } = await openpgp.sign({
    //     message: openpgp.cleartext.fromText(JSON.stringify(req.body)), // CleartextMessage or Message object
    //     privateKeys: [privateKey]                         // for signing
    // });

    //Create Sign to Compare
    const sign = cryptoJS.HmacSHA256(data, config.bankingAuth.secret).toString();
    console.log(sign);
    console.log(req.headers);
    console.log(req.body);
    if(sign !== req.headers['sign']){
        throw createError(400, 'Signature is wrong!');
    }
    
    if(req.headers['partner_code'] !== config.bankingAuth.partnerKey){
        throw createError(400, 'Invalid partner code!');
    }

    let {cleartext} = req.body;
    console.log(cleartext);

        const verified = await openpgp.verify({
            message: await openpgp.cleartext.readArmored(cleartext),           // parse armored message
            publicKeys: (await openpgp.key.readArmored(PUBLIC_KEY)).keys // for verification
        });
        const { valid } = verified.signatures[0];
        if (valid) {
            console.log('signed by key id ' + verified.signatures[0].keyid.toHex());
            data.success = "true";
        }
        else {
            throw new Error('signature could not be verified');
    }    

    let dataObj = cleartext.slice(
        cleartext.indexOf('{'),
        cleartext.indexOf('}') + 1
    );

    let dataRS = JSON.parse(dataObj);
    console.log(dataRS);
    
    req.body = dataRS;

    console.log(moment().unix());

    const ts = moment().unix();
    const timeExp = moment.unix(headerTs).add(10, 'm').unix();

    if(ts > timeExp){
        console.log(moment().unix());
        throw createError(400, 'Request expire!');
    }

    next();
}
