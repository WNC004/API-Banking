var nodemailer = require("nodemailer");

const output = verifyEntity => {
  const { clientName, otp } = verifyEntity;
  return `
    <p>Dear <i>${clientName}</i>, </p>
    <p>We have generated a One-Time Passcode for your transaction. </p>
    <p><b>Your One-Time Passcode is: ${otp}</b></p>
    <p>Please enter this code into the form that you have accessed.</p>
    <p>Thank you for utilizing our services,</p>
    <p>Banking team</p>
  `;
};

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "jenkin.testing@gmail.com",
    pass: "1234@4567"
  }
});

exports.sendMail = verifyEntity => {
  const { clientEmail } = verifyEntity;
  var mailOptions = {
    from: "jenkin.testing@gmail.com",
    to: clientEmail,
    subject: "Verify transaction",
    html: output(verifyEntity)
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
