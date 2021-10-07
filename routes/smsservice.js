var express = require("express");
var router = express.Router();
var axios = require("axios");
var mysqlConnection = require("../model/db");

var smsCredentials = require("../model/smsCredentials");
var transporter = require("../model/email");
var mailOptions = require("../model/email");
var mailTypes = require("../model/mailtype");

router.post("/notify/:id/:month", function (req, res) {
  var id = req.params.id;
  var month = req.params.month;

  if (id) {
    mysqlConnection.query(
      "SELECT * FROM student_information where StudentId='" + id + "'",
      function (err, result) {
        if (err) {
          console.log(err);
        } else {
          var mobileNumber = result[0].MobileNumber;
          var email = result[0].Email;
          var name = result[0].FirstName + " " + result[0].LastName;

          var message =
            "This%20message%20is%20from%20ORACLE.%20This%20is%20to%20inform%20you%20that%20your%20child%2C%20%20" +
            name +
            "%20has%20an%20outstanding%20monthly%20fee%20for%20" +
            month +
            ".";

          var url =
            "http://www.textit.biz/sendmsg?id=" +
            smsCredentials?.id +
            "&pw=" +
            smsCredentials.pw +
            "&to=" +
            mobileNumber +
            "&text=" +
            message;

          var config = {};
          if (mobileNumber && month && name && email) {
            // axios.post(url, config).then(function (response) {
            //   console.log(response.data);
            //   console.log(response.status);
            //   console.log(response.statusText);
            //   console.log(response.headers);
            //   console.log(response.config);
            // });
            sendEmail(email, message, mobileNumber);
            res.render("messagesent", {
              message:
                "Message is successfully sent to: " +
                mobileNumber +
                " and " +
                email,
            });
          }
        }
      }
    );
  }
});

function sendEmail(email, text) {
  mailOptions.to = email;
  mailOptions.subject = mailTypes.DuePayment.subject;
  mailOptions.text = "Hi,\n\n" + decodeURI(text).replace(/%2C/g, ",");

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
      mysqlConnection.query(
        "Insert into sent_emails (Response,ToMail,MailBody,MailType,Date) VALUES ('" +
          info.response +
          "','" +
          mailOptions.to +
          "','" +
          mailOptions.text +
          "','" +
          mailTypes.DuePayment.type +
          "','" +
          new Date().toISOString() +
          "')",
        function (err, result) {
          if (err) {
            console.log(err);
          }
        }
      );
    }
  });
}

module.exports = router;
