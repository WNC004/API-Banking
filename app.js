const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('express-async-errors');

const verify = require('./middlewares/auth.mdw');

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    msg: 'hello from nodejs express api'
  });
})

app.use('/api/auth', require('./routes/auth.route'));
app.use('/api/customers', require('./routes/customer.route'));
app.use('/api/bank', require('./routes/tranfer.route'));

app.use((req, res, next) => {
  res.status(404).send('NOT FOUND');
})

app.use(function (err, req, res, next) {
  console.log(err.stack);
  // console.log(err.status);
  const statusCode = err.status || 500;
  res.status(statusCode).send('View error log on console.');
})

const PORT = 3000;
app.listen(PORT, _ => {
  console.log(`API is running at http://localhost:${PORT}`);
})
// {
//   "mysql": {
//     "connectionLimit": 100,
//     "host"    : "db4free.net",
//     "user"    : "WNC004",
//     "password": "P@ssword123456",
//     "database": "WNC004"
//   },
//   "auth": {
//     "secret": "secretKey",
//     "expiresIn": "10m",
//     "refreshTokenSz": 80
//   }
// }
// "pgpPublicKey": "xm8EXrUUKBMFK4EEACIDAwQvNEDRmAnvXquRh8d1r8Zus7Bk1A7gxKj+/ykQBsaAzhVCtpj+7eG3chT4bAvnf1kXkhd8HtVvSnZMDkv0HP0DzZyX0QAUQQPDkTlgE9mq5RXAI2hq+fy3L5g8POrapSPNIVRyYSAoc2VjcmV0KSA8ZHVjdHJhcHRAZ21haWwuY29tPsKPBBMTCgAXBQJetRQoAhsvAwsJBwMVCggCHgECF4AACgkQemJTP6T6fNcfTgF/dzar6yAp6DUlJZ3kU/SAERUTgA3TYpS+YKNMO82EjUk1FPpyNYyGfnMax6Q6RNimAX4ti8Y4+AzBIh4sQy++HQ9/KGjUd+rxTDUQCx7h5KwgJ+eL4pS5TXLUANUEzvj/W2LOUgRetRQoEwgqhkjOPQMBBwIDBNlR8Qafm3k82/e15kjUJ2WpEP2XlT7GTWnOd8fMAw5QZY416/DjoXgFjip9RKPhvbWholvI+OFEigwGnXlORqjCwCcEGBMKAA8FAl61FCgFCQ8JnAACGy4AagkQemJTP6T6fNdfIAQZEwoABgUCXrUUKAAKCRCqutDledlTvSoQAQCuH759wc/KpoM+me813HWnN/i9wf275Atqv/3OTfwoBAD/UwwMHaZbSWaCrju785VSC/QBShCEBxoxwKoI3osRyt0a9AGAn4vJpHtx46EQ+oLPO6W2oOC68+ZrU6Yyv6yfHqFH7anyTXr8dwQvlLNo8igcqQQ3AXsEmn9XGtU0BJgDZF08PteDM60aTcMtePwqMhsSOqs9+9S+BskynkgmkCamEAE+w53OUgRetRQoEwgqhkjOPQMBBwIDBDEJ6ETfO+zfbELP1my4FK+m0nZG0G0nYZwyvUnQJWxm9zKbHKLMTmbKDZaWz0yxrRGoTgX5vzlSsd/LX5IrHqrCwCcEGBMKAA8FAl61FCgFCQ8JnAACGy4AagkQemJTP6T6fNdfIAQZEwoABgUCXrUUKAAKCRBjHAeSV3/mGRtsAQDNo17QBYjlDpChHakCHgW1hpIoSuDEv8KJl5eP4HY1yQEAnszqKP5xNvaFuGQvaBtXpm9Eg9gjAiwF1/X23x+q/OqCEQGAkJbZ85lep3cNHaKH22393qRZD0gj1Efro3B0YoknlpwtOKYR07JDVmrP4zwokD4iAYCUS8bKE+aCaE8srEIbHPRnCqpu9lOPsmRjg1a91RcQ6hxP7a0iBuy9nJGTxvscmJM==Ws0e",
//     "pgpPrivateKey": "xcASBF61FCgTBSuBBAAiAwMELzRA0ZgJ716rkYfHda/GbrOwZNQO4MSo/v8pEAbGgM4VQraY/u3ht3IU+GwL539ZF5IXfB7Vb0p2TA5L9Bz9A82cl9EAFEEDw5E5YBPZquUVwCNoavn8ty+YPDzq2qUj/gkDCE70WIkhmEmgYPKwHvv2c5hoR3v+Hw5ng5Yn90ol6Swj5xdyEplQnvGb9uUCE60mzkj8lrhSUgVvusagwQgdQKd5nhzAq3+eBBuDxXChWgMs6MrOacO9cmtad6UizKiyzSFUcmEgKHNlY3JldCkgPGR1Y3RyYXB0QGdtYWlsLmNvbT7CjwQTEwoAFwUCXrUUKAIbLwMLCQcDFQoIAh4BAheAAAoJEHpiUz+k+nzXH04Bf3c2q+sgKeg1JSWd5FP0gBEVE4AN02KUvmCjTDvNhI1JNRT6cjWMhn5zGsekOkTYpgF+LYvGOPgMwSIeLEMvvh0Pfyho1Hfq8Uw1EAse4eSsICfni+KUuU1y1ADVBM74/1tix6UEXrUUKBMIKoZIzj0DAQcCAwTZUfEGn5t5PNv3teZI1CdlqRD9l5U+xk1pznfHzAMOUGWONevw46F4BY4qfUSj4b21oaJbyPjhRIoMBp15Tkao/gkDCAlNcI8AGjhdYDi3xMD1/NvCDYXCRO79QwHnrRs8iqqoksffeKrPSTZjuKtig/qvQvaCn6LGsuTGvg2+yKRQ2Toa6/iTMYcA6VuXfMrU+R/CwCcEGBMKAA8FAl61FCgFCQ8JnAACGy4AagkQemJTP6T6fNdfIAQZEwoABgUCXrUUKAAKCRCqutDledlTvSoQAQCuH759wc/KpoM+me813HWnN/i9wf275Atqv/3OTfwoBAD/UwwMHaZbSWaCrju785VSC/QBShCEBxoxwKoI3osRyt0a9AGAn4vJpHtx46EQ+oLPO6W2oOC68+ZrU6Yyv6yfHqFH7anyTXr8dwQvlLNo8igcqQQ3AXsEmn9XGtU0BJgDZF08PteDM60aTcMtePwqMhsSOqs9+9S+BskynkgmkCamEAE+w53HpQRetRQoEwgqhkjOPQMBBwIDBDEJ6ETfO+zfbELP1my4FK+m0nZG0G0nYZwyvUnQJWxm9zKbHKLMTmbKDZaWz0yxrRGoTgX5vzlSsd/LX5IrHqr+CQMIGbOoxWiijy9gSAt/j3J60cKgeVnUY9cpB6X+gZWJCjOseAWwrZxB/XtuapOntl+W0pdXySBuKv0sbZ09DJbEwalYqnDz0WnWFPos+DMwYcLAJwQYEwoADwUCXrUUKAUJDwmcAAIbLgBqCRB6YlM/pPp8118gBBkTCgAGBQJetRQoAAoJEGMcB5JXf+YZG2wBAM2jXtAFiOUOkKEdqQIeBbWGkihK4MS/womXl4/gdjXJAQCezOoo/nE29oW4ZC9oG1emb0SD2CMCLAXX9fbfH6r86oIRAYCQltnzmV6ndw0doofbbf3epFkPSCPUR+ujcHRiiSeWnC04phHTskNWas/jPCiQPiIBgJRLxsoT5oJoTyysQhsc9GcKqm72U4+yZGODVr3VFxDqHE/trSIG7L2ckZPG+xyYkw===uAGy",
    