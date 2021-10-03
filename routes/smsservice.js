var express = require("express");
var router = express.Router();
var axios = require("axios");

var smsCredentials = require("../model/smsCredentials");

router.post("/notify/:firstName/:number/:month", function (req, res) {
  var mobileNumber = req.params.number;
  var month = req.params.month;
  var firstName = req.params.firstName;

  var message =
    "This%20message%20is%20from%20ORACLE.%20This%20is%20to%20inform%20you%20that%20your%20child%2C%20%20" +
    firstName +
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
  if (mobileNumber && month && firstName) {
    // axios.post(url, config).then(function (response) {
    //   console.log(response.data);
    //   console.log(response.status);
    //   console.log(response.statusText);
    //   console.log(response.headers);
    //   console.log(response.config);
    // });
    res.render("messagesent", {
      message: "Message is successfully sent to: " + mobileNumber,
    });
  }
});

module.exports = router;
