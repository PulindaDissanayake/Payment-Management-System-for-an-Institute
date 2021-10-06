var express = require("express");
var router = express.Router();

router.get("/home/signedin/student", isUserLoggedIn, function (req, res) {
  var signIn = `Welcome ${req.session.username}`;
  var login = "#";
  var home = "#";
  var studentinfo = "";
  var paymentinfo = "";
  var addpayment = "";
  var reglink = `<a class='nav-link ' href='/mypayments/${req.session.username}'> My payments </a>`;
  var signOut = "<a class='nav-link ' href='/logout'> Log Out </a>";
  var news = "<a class='nav-link' href='/news'>News</a>";
  var sentMails = "";
  res.render("home", {
    signIn,
    login,
    studentinfo,
    paymentinfo,
    addpayment,
    home,
    reglink,
    signOut,
    news,
    sentMails,
  });
});

router.get("/home/signedin/admin", isAdminLoggedIn, function (req, res) {
  var signIn = `Welcome ${req.session.username}`;
  var home = "#";
  var login = "";
  var studentinfo =
    "<a class='nav-link' href='/adminstudentinfo'>Student Information</a>";
  var paymentinfo = "<a class='nav-link' href='/paymentinfo'>Paymentinfo</a>";
  var addpayment = "<a class='nav-link' href='/payform'>Add Payments</a>";
  var reglink =
    "<a class='nav-link ' href='/register'> Register Students</a>";
  var signOut = "<a class='nav-link ' href='/logout'> Log Out</a>";
  var news = "<a class='nav-link' href='/news'>News</a>";
  var sentMails = "<a class='nav-link' href='/emails'>Sent Emails</a>";
  res.render("home", {
    signIn,
    login,
    studentinfo,
    paymentinfo,
    addpayment,
    home,
    reglink,
    signOut,
    news,
    sentMails,
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
