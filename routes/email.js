var express = require("express");
var router = express.Router();
var mysqlConnection = require("../model/db");

router.get("/emails", isAdminLoggedIn, function (req, res) {
  mysqlConnection.query(
    "SELECT * FROM sent_emails ",
    function (err, result) {
      if (err) {
        console.log(err);
      } else {
        res.render("sentmails", { mailinfo: result });
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

module.exports = router;
