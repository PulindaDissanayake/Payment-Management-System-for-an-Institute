var express = require("express");
var router = express.Router();
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
      "SELECT*FROM logininfo WHERE UserName = ? AND Password = ? ",
      [username, password],
      function (err, results) {
        if (err) throw err;
        if (results.length > 0) {
          req.session.loggedin = true;
          req.session.username = username;

          if (results[0].Admin === 2) {
            res.redirect("/home/signedIn/admin");
          } else {
            res.redirect("/home/signedIn/student");
          }
        } else {
          res.render("login", { error: "Incorrect Username and/or Password!" });
        }
        res.end();
      }
    );
  } else {
    res.render("login", { error: "Please enter Username and Password!" });
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
      var login = "/login";
      var home = "#";
      var studentinfo = "";
      var paymentinfo = "";
      var addpayment = "";
      var reglink = ""; //<a class='nav-link ' href='/register'> Register </a>";
      var signOut = "";
      var news = "<a class='nav-link' href='/news'>News</a>";
      res.render("home", {
        signIn,
        login,
        home,
        studentinfo,
        paymentinfo,
        addpayment,
        reglink,
        signOut,
        news,
      });
    }
  });
  

router.get("/logout", function (req, res) {
    // req.session.currentUser = null;
    req.session.destroy();
    res.redirect("/home");
  });

module.exports = router;
