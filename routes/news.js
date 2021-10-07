var express = require("express");
var router = express.Router();
var mysqlConnection = require("../model/db");
var transporter = require("../model/email");
var mailOptions = require("../model/email");
var mailTypes = require("../model/mailtype");

router.get("/news", function (req, res) {
  var admin =
    "<a href='#popup1'><button class='btn btn-info float-sm-right float-none mt-2'>Add News</button></a>";
  var user = "";
  mysqlConnection.query("SELECT * FROM news ", function (err, result) {
    if (err) {
      console.log(err);
    } else {
      var sortedresult = result.sort((a, b) =>
        a.Date < b.Date ? 1 : b.Date < a.Date ? -1 : 0
      );
      if (req?.session?.loggedin) {
        if (req?.session?.username === "Admin") {
          res.render("news", { news: sortedresult, addNews: admin });
        } else {
          res.render("news", { news: sortedresult, addNews: user });
        }
      } else {
        res.render("news", { news: sortedresult, addNews: user });
      }
    }
  });
});

router.post("/news", isAdminLoggedIn, function (req, res) {
  var news = req.body.news;
  var aposNews = news.replace(/\'/g, "\\'");
  var date = new Date().toISOString();
  var grade = req.body.grade;

  if (news && date) {
    mysqlConnection.query(
      "Insert into news (Description,Date) VALUES ('" +
        aposNews +
        "','" +
        date +
        "')",
      function (err, result) {
        if (err) {
          console.log(err);
        } else {
          res.redirect("/news");
        }
      }
    );
  }
  if ((grade, news)) {
    sendEmail(grade, aposNews);
  }
});

function isAdminLoggedIn(req, res, next) {
  if (req.session.loggedin && req.session.username === "Admin") {
    return next();
  } else {
    res.redirect("/login");
  }
}

function sendEmail(grade, news) {
  mysqlConnection.query(
    "SELECT Email FROM student_information where Grade='" + grade + "'",
    function (err, result) {
      if (err) {
        console.log(err);
      } else if (result.length !== 0) {
        mailOptions.to = Array.prototype.map
          .call(result, function (item) {
            return item.Email;
          })
          .join(",");
        mailOptions.subject =mailTypes.News.subject;
        mailOptions.text = news;

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
                mailTypes.News.type +
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
