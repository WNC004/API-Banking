require('dotenv').config();

let CONFIG = {};

// Current ENV
CONFIG.current_env = process.env.CURRENT_ENV || 'production';

// Port
CONFIG.port = process.env.PORT || '3001';

// Database
CONFIG.mongodb_uri = process.env.MONGODB_URI || 'mongodb+srv://admin:P@ssword123456@cluster0-ffdnj.mongodb.net/react-bank-api?retryWrites=true&w=majority';

// JWT
CONFIG.jwt_secret_key =
   process.env.JWT_SECRET_KEY || 'f5HxCefwrdShD8P8ncPh4qFAktdnjAujASWjGxdmDVHHD4rZKWpBbjPEcDqmeP7u';
CONFIG.jwt_expiration = process.env.JWT_EXPIRATION || '1d';

// Mailgun
CONFIG.mailgun_api_key = process.env.MAILGUN_API_KEY || '50198051801b493168ca859c0959ca45-8b34de1b-055eb70c';
CONFIG.mailgun_domain = process.env.MAILGUN_DOMAIN || 'sandbox7cfe232192d9465590db2db080c7eca9.mailgun.org';
CONFIG.mailgun_host = process.env.MAILGUN_HOST || '';

module.exports = CONFIG;

// module.exports = {
//    development: {

//    },
//    test: {

//    },
//    production: {

//    }
// }
