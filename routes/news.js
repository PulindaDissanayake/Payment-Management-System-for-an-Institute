var express = require("express");
var router = express.Router();
var mysqlConnection = require("../model/db");

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
  var aposNews = news.replace(/\'/g, "\\\'");
  var date = req.body.date;

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
});

function isAdminLoggedIn(req, res, next) {
    if (req.session.loggedin && req.session.username === "Admin") {
      return next();
    } else {
      res.redirect("/login");
    }
  }

module.exports = router;
