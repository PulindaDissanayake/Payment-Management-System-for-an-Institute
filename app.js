var express = require("express");
var app = express();
var session = require("express-session");

var newsRoutes = require("./routes/news");
var authRoutes = require("./routes/auth");
var userRolesRoutes = require("./routes/userroles");
var smsRoutes = require("./routes/smsservice");
var paymentRoutes = require("./routes/payments");
var studentRoutes = require("./routes/students");
var emailRoutes = require("./routes/email");

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 2,
    },
  })
);

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.get("/", function (req, res) {
  res.render("landing");
});

app.use(newsRoutes);
app.use(authRoutes);
app.use(userRolesRoutes);
app.use(smsRoutes);
app.use(paymentRoutes);
app.use(studentRoutes);
app.use(emailRoutes);

app.listen("3000", function () {
  console.log("Server is listening at port 3000");
});
