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

const notifctionContent = verifyEntity => {
  const { clientName, action } = verifyEntity;
  return `
    <p>Dear <i>${clientName}</i>, </p>
    <p>Your debt has been deleted by ${action}. Please check from system!</p>
    <p>Thank you for utilizing our services,</p>
    <p>Banking team</p>
  `;
};

const notifction = verifyEntity => {
  const { debtor, creditor, amount } = verifyEntity;
  return `
    <p>Dear <i>${debtor}</i>, </p>
    <p>Bạn có mượn ${creditor} ${amount} VND. Hãy trả cho ${creditor} sớm nhé!</p>
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

exports.sendNotificationDeleteDebt = verifyEntity => {
  const { clientEmail } = verifyEntity;
  var mailOptions = {
    from: "jenkin.testing@gmail.com",
    to: clientEmail,
    subject: "Deleted Debt",
    html: notifctionContent(verifyEntity)
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

exports.sendNotification = verifyEntity => {
  const { clientEmail } = verifyEntity;
  var mailOptions = {
    from: "jenkin.testing@gmail.com",
    to: clientEmail,
    subject: "Reminder debt",
    html: notifction(verifyEntity)
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
