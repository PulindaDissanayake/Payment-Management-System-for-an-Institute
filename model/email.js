var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'oracleinstituteapura@gmail.com',
    pass: 'Apura@oracle1'
  },
  tls: {
      rejectUnauthorized: false
  }

});

var mailOptions = {
  from: 'oracleinstituteapura@gmail.com',
  to: '',
  subject: '',
  text: ''
};

module.exports = transporter, mailOptions;