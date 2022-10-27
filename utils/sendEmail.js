const nodemailer = require('nodemailer');

const sendEmail = (obj) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAILID, // generated ethereal user
            pass: process.env.MAIL_PASSWORD, // generated ethereal password
        },
    });
    var mailOptions = {
        from: process.env.EMAILID,
        to: obj.email,
        subject: obj.subject,
        text: obj.message
    }
    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(`Email sent:` + info.response);
        }
    })
}
module.exports = sendEmail;