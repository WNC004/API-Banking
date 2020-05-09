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

const PORT = process.env.PORT || 3000;
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