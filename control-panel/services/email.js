
const nodemailer = require('nodemailer');

const sendEmail = async (toEmail, subject, body) => {

    let transport = nodemailer.createTransport({
        host: 'smtp-relay.sendinblue.com',
        port: 587,
        auth: {
           user: process.env.EMAIL_USER,
           pass: process.env.EMAIL_PASS
        }
    });

    const message = {
        from: 'servermail@sendinblue.com',
        to: toEmail,
        subject: subject,
        html: body
    };
   await transport.sendMail(message, function(err, info) {
        if (err) {
          console.log(err);
          return err;
        } else {
          console.log(info);
        }
    });
}


module.exports = { sendEmail };