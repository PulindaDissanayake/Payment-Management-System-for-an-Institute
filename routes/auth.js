var express = require("express");
var router = express.Router();
var bcrypt = require("bcryptjs");
var mysqlConnection = require("../model/db");

router.get("/login", function (req, res) {
  var message = "";
  //shows the login page
  res.render("login", { error: message });
});

router.post("/login", function (req, res) {
  //take details from the form
  var username = req.body.username;
  var password = req.body.password;
  if (username && password) {
    mysqlConnection.query(
      "SELECT*FROM logininfo WHERE UserName = ? ",
      [username],
      function (err, results) {
        if (err) throw err;
        if (results.length > 0) {
          var comparison = authenticate(
            password,
            results[0]?.Password,
            results[0]?.Admin
          );
          if (comparison) {
            req.session.loggedin = true;
            req.session.username = username;

            if (results[0].Admin === 2) {
              res.redirect("/home/signedIn/admin");
            } else {
              res.redirect("/home/signedIn/student");
            }
          } else {
            res.render("login", {
              error: "Incorrect Password!",
            });
          }
        } else {
          res.render("login", { error: "Incorrect Username!" });
        }
        res.end();
      }
    );
  } else {
    res.render("login", { error: "Please enter both Username and Password!" });
    res.end();
  }
  //redirect to home page
});

router.get("/home", function (req, res) {
  if (req?.session?.loggedin) {
    if (req?.session?.username === "Admin") {
      res.redirect("/home/signedIn/admin");
    } else {
      res.redirect("/home/signedIn/student");
    }
  } else {
    var signIn = "Sign In";
    var reglink = "";
    var signOut = "";
    var news = "<a class='nav-link' href='/news'>News</a>";
    var sentMails = "";
    var dropdownStudents= "";
    var dropdownPayments = "";
    var login = "/login";
    res.render("home", {
      signIn,
      reglink,
      signOut,
      news,
      sentMails,
      dropdownStudents,
      dropdownPayments,
      login,
    });
  }
});

router.get("/logout", function (req, res) {
  req.session.destroy();
  res.render("login", { error: "You have logged out successfully" });
});

function authenticate(password, passwordDB, admin) {
  if (admin === 2) {
    return password.trim() === passwordDB.trim();
  } else {
    return bcrypt.compareSync(password, passwordDB);
  }
}
module.exports = router;
