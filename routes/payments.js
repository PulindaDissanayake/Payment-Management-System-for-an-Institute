var express = require("express");
var router = express.Router();
var mysqlConnection = require("../model/db");
var transporter = require("../model/email");
var mailOptions = require("../model/email");
var mailTypes = require("../model/mailtype");

router.get("/mypayments/:id", isUserLoggedIn, function (req, res) {
  mysqlConnection.query(
    "SELECT payments.PaymentId,payments.Month,payments.Amount,student_information.FirstName FROM payments INNER JOIN student_information ON payments.StudentId=student_information.StudentId WHERE student_information.username ='" +
      req.params.id +
      "'",
    function (err, result) {
      if (err) {
        console.log(err);
      } else {
        res.render("mypayments", {
          mypayment: result,
          username: req.session.username,
        });
      }
    }
  );
});

router.get("/payform", isAdminLoggedIn, function (req, res) {
  mysqlConnection.query(
    "SELECT * FROM student_information ",
    function (err, result) {
      if (err) {
        console.log(err);
      } else {
        res.render("payform", {
          studentinfo: result,
          message: "",
          error: "",
        });
      }
    }
  );
});

router.post("/payform", function (req, res) {
  var username = req.body.username;
  var amount = req.body.amount;
  var year = req.body.year;
  var month1 = req.body.month;

  var date = year + "-" + month1;

  var news =
    "Hi " +
    username +
    ",\n\n" +
    "We received your " +
    date +
    " payment of rs." +
    amount +
    ". " +
    "We value you as a preferred customer and Please call us if you have any problems.";

  if (username && month1 && year && amount) {
    mysqlConnection.query(
      "SELECT StudentId FROM student_information where UserName='" +
        username +
        "'",
      function (err, result1) {
        if (err) {
          console.log(err);
        } else {
          console.log(result1);
          mysqlConnection.query(
            "Insert into payments (Amount,Month,StudentId) VALUES ('" +
              amount +
              "','" +
              date +
              "'," +
              result1[0].StudentId +
              ")",
            function (err, result2) {
              if (err) {
                console.log(err);
              } else {
                mysqlConnection.query(
                  "SELECT * FROM student_information ",
                  function (err, result3) {
                    if (err) {
                      console.log(err);
                    } else {
                      res.render("payform", {
                        studentinfo: result3,
                        error: "",
                        message:
                          username +
                          "'s fees( " +
                          amount +
                          " rupees ) for " +
                          date +
                          " added",
                      });
                    }
                  }
                );
                if ((result1[0].StudentId, news)) {
                  sendEmail(result1[0].StudentId, news);
                }
              }
            }
          );
        }
      }
    );
  } else {
    mysqlConnection.query(
      "SELECT * FROM student_information ",
      function (err, result4) {
        if (err) {
          console.log(err);
        } else {
          res.render("payform", {
            studentinfo: result4,
            message: "",
            error: "Please fill all the inputs",
          });
        }
      }
    );
  }
});

router.get("/paymentinfo", isAdminLoggedIn, function (req, res) {
  mysqlConnection.query(
    "SELECT payments.PaymentId,payments.Month,payments.Amount,student_information.FirstName,student_information.LastName FROM payments INNER JOIN student_information ON payments.StudentId=student_information.StudentId",
    function (err, result) {
      if (err) {
        console.log(err);
      } else {
        // console.log(result);
        res.render("paymentinfo", { paymentinfo: result });
      }
    }
  );
});

router.get("/absentpayment", function (req, res) {
  var year = req.query.year;
  var month = req.query.month;

  var date = year + "-" + month;

  mysqlConnection.query(
    "SELECT StudentId,FirstName,MobileNumber,Grade FROM student_information WHERE StudentId not in (SELECT DISTINCT StudentId FROM payments WHERE Month='" +
      date +
      "' )",
    function (err, result) {
      if (err) {
        console.log(err);
      } else {
        res.render("monthlypayments", {
          studentpayinfo: result,
          selectedmonth: date,
        });
      }
    }
  );
});

function isAdminLoggedIn(req, res, next) {
  if (req.session.loggedin && req.session.username === "Admin") {
    return next();
  } else {
    res.redirect("/login");
  }
}

function isUserLoggedIn(req, res, next) {
  if (req.session.loggedin && req.session.username !== "Admin") {
    return next();
  } else {
    res.redirect("/login");
  }
}

function sendEmail(studentId, text) {
  mysqlConnection.query(
    "SELECT Email FROM student_information where StudentId='" + studentId + "'",
    function (err, result) {
      if (err) {
        console.log(err);
      } else if (result.length !== 0) {
        mailOptions.to = Array.prototype.map
          .call(result, function (item) {
            return item.Email;
          })
          .join(",");
        mailOptions.subject = mailTypes.Payment.subject;
        mailOptions.text = text;

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
                mailTypes.Payment.type +
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
    }
  );
}

module.exports = router;
