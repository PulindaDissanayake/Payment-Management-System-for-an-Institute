var express = require("express");
var router = express.Router();
var mysqlConnection = require("../model/db");

router.get("/emails", isAdminLoggedIn, function (req, res) {
  mysqlConnection.query("SELECT * FROM sent_emails ", function (err, result) {
    if (err) {
      console.log(err);
    } else {
      var sortedresult = result.sort((a, b) =>
        a.Date < b.Date ? 1 : b.Date < a.Date ? -1 : 0
      );
      res.render("sentmails", { mailinfo: sortedresult });
    }
  });
});

function isAdminLoggedIn(req, res, next) {
  if (req.session.loggedin && req.session.username === "Admin") {
    return next();
  } else {
    res.redirect("/login");
  }
}

module.exports = router;
