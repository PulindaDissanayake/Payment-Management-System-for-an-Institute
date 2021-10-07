var express = require("express");
var router = express.Router();

router.get("/home/signedin/student", isUserLoggedIn, function (req, res) {
  var signIn = `Signed in as ${req.session.username}`;
  var reglink = `<a class='nav-link ' href='/mypayments/${req.session.username}'> My payments </a>`;
  var signOut = "<a class='nav-link ' href='/logout'> Log Out </a>";
  var news = "<a class='nav-link' href='/news'>News</a>";
  var sentMails = "";
  var dropdownStudents = "";
  var dropdownPayments ="";
  var login = "";
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
});

router.get("/home/signedin/admin", isAdminLoggedIn, function (req, res) {
  var signIn = `Signed in as ${req.session.username}`;
  var reglink = "";
  var signOut = "<a class='nav-link ' href='/logout'> Log Out</a>";
  var news = "<a class='nav-link' href='/news'>News</a>";
  var sentMails = "<a class='nav-link' href='/emails'>Sent Emails</a>";
  var dropdownStudents =
    "<li class='nav-item dropdown'>" +
    "<a class='nav-link dropdown-toggle' href='#' id='navbarDropdown' role='button' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>" +
    "Students</a><div class='dropdown-menu' aria-labelledby='navbarDropdown'><a class='dropdown-item' href='/adminstudentinfo'>Student Information</a>" +
    "<div class='dropdown-divider'></div><a class='dropdown-item' href='/register'> Register Students</a></div></li>";
  var dropdownPayments = "<li class='nav-item dropdown'>" +
  "<a class='nav-link dropdown-toggle' href='#' id='navbarDropdown' role='button' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>" +
  "Payments</a><div class='dropdown-menu' aria-labelledby='navbarDropdown'><a class='dropdown-item' href='/paymentinfo'>Payment Information</a>" +
  "<div class='dropdown-divider'></div><a class='dropdown-item' href='/payform'>Add Payments</a></div></li>";
  var login = "";
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

module.exports = router;
