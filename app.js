var express = require("express");
var app = express();
var session = require("express-session");

var newsRoutes = require("./routes/news");
var authRoutes = require("./routes/auth");
var userRoutes = require("./routes/userroles");
var smsRoutes = require("./routes/smsservice");
var paymentRoutes = require("./routes/payments");
var studentRoutes = require("./routes/students");

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
app.use(userRoutes);
app.use(smsRoutes);
app.use(paymentRoutes);
app.use(studentRoutes);

app.listen("3000", function () {
  console.log("Connected");
});
