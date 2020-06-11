const CONFIG = require('@config/config');

const nodemailer = require('nodemailer');
//const mailgunTransport = require('nodemailer-mailgun-transport');

// const options = {
//    auth: {
//       api_key: CONFIG.mailgun_api_key,
//       domain: CONFIG.mailgun_domain
//    }
// };

// const nodemailerMailgun = nodemailer.createTransport(mailgunTransport(options));

// exports.sendEmail = (template, data) => {
//    //const { emailTpl } = require(`./templates/${template}`);
//    //const readyTpl = emailTpl(data);

  
//    console.log(data.from);
//    console.log(data.to);

//    data.subject = "Transfer successfully";
//    data.text = "Thank you!";

//    return new Promise((resolve, reject) => {
//       resolve();
//       nodemailerMailgun.sendMail({ ...data }, (err, info) => {
//          if (err) {
//             console("ERR");
//             reject(err);
//          } else {
//             console.log("SUCCESS")
//             resolve(info);
//          }
//       });
//    });
// };
// Step 1
let transporter = nodemailer.createTransport({
   service: 'gmail',
   auth: {
       user: process.env.EMAIL || 'ductrapt@gmail.com', // TODO: your gmail account
       pass: process.env.PASSWORD || 'ductra123' // TODO: your gmail password
   }
});



// Step 3
exports.sendEmail = (mailOptions) => transporter.sendMail(mailOptions, (err, data) => {
   if (err) {
       return log('Error occurs');
   }
   return log('Email sent!!!');
});
