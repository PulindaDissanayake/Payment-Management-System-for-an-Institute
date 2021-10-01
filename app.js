var express = require("express");
var app = express();
var session = require("express-session");
var axios = require("axios");
var mysqlConnection = require("./model/db");

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 1 * 10 * 60 * 1000,
    },
  })
);

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.get("/", function (req, res) {
  res.render("landing");
});

app.get("/home", function (req, res) {
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
    res.render("home", {
      signIn: signIn,
      login: login,
      home: home,
      studentinfo: studentinfo,
      paymentinfo: paymentinfo,
      addpayment: addpayment,
      reglink: reglink,
      signOut: signOut,
    });
  }
});

app.get("/home/signedin/admin", function (req, res) {
  if (req.session.loggedin && req.session.username === "Admin") {
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
    res.render("home", {
      signIn: signIn,
      login: login,
      studentinfo: studentinfo,
      paymentinfo: paymentinfo,
      addpayment: addpayment,
      home: home,
      reglink: reglink,
      signOut: signOut,
    });
  } else {
    //res.send('You have to log in');
    res.redirect("/login");
  }
});

app.get("/home/signedin/student", function (req, res) {
  if (req.session.loggedin && req.session.username !== "Admin") {
    var signIn = `Welcome ${req.session.username}`;
    var login = "#";
    var home = "#";
    var studentinfo = "";
    var paymentinfo = "";
    var addpayment = "";
    var reglink = "<a class='nav-link ' href='/mypayments'> My payments </a>";
    var signOut = "<a class='nav-link ' href='/logout'> Log Out </a>";
    res.render("home", {
      signIn: signIn,
      login: login,
      studentinfo: studentinfo,
      paymentinfo: paymentinfo,
      addpayment: addpayment,
      home: home,
      reglink: reglink,
      signOut: signOut,
    });
  } else {
    res.redirect("/login");
  }
});

app.get("/mypayments", function (req, res) {
  if (req.session.loggedin && req.session.username !== "Admin") {
    mysqlConnection.query(
      "SELECT payments.PaymentId,payments.Month,payments.Amount,student_information.FirstName FROM payments INNER JOIN student_information ON payments.StudentId=student_information.StudentId WHERE student_information.username ='" +
        req.session.username +
        "'",
      function (err, result) {
        if (err) {
          console.log(err);
        } else {
          res.render("mypayments", {
            mypayment: result,
            username: req.session.username,
          });
        }
      }
    );
  } else {
    res.redirect("/login");
  }
});

app.get("/login", function (req, res) {
  var message = "";
  //shows the login page
  res.render("login", { error: message });
});

app.post("/login", function (req, res) {
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

app.get("/register", function (req, res) {
  if (req.session.loggedin && req.session.username === "Admin") {
    res.render("register", { error: "", success: "" });
  } else {
    res.redirect("/login");
  }
});

app.post("/register", function (req, res) {
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var birthday = req.body.birthday;
  var guardian = req.body.guardian;
  var mobileNo = req.body.mobileNo;
  var school = req.body.school;
  var grade = req.body.grade;
  var email = req.body.email;
  var cpassword = req.body.cpassword;
  // var index = req.body.index;
  mysqlConnection.query(
    "Insert into student_information (FirstName,LastName,Birthday,GuardianName,MobileNumber,School,Grade,Username) VALUES ('" +
      firstName +
      "','" +
      lastName +
      "','" +
      birthday +
      "','" +
      guardian +
      "','" +
      mobileNo +
      "','" +
      school +
      "'," +
      grade +
      ",'" +
      email +
      "')",
    function (err, result) {
      if (err) {
        console.log(err);
        res.render("register", { error: err?.sqlMessage, success: "" });
      } else {
        mysqlConnection.query(
          "Insert into logininfo (ID,UserName,Password)  VALUES ('" +
            result?.insertId +
            "','" +
            email +
            "','" +
            cpassword +
            "')",
          function (err, result) {
            if (err) {
              console.log(err);
            } else {
              res.render("register", {
                success: "Student is registered : " + email,
                error: "",
              });
            }
          }
        );
      }
    }
  );
});

app.get("/adminstudentinfo", function (req, res) {
  if (req.session.loggedin && req.session.username === "Admin") {
    mysqlConnection.query(
      "SELECT * FROM student_information ",
      function (err, result) {
        if (err) {
          console.log(err);
        } else {
          res.render("adminstudentinfo", { studentinfo: result });
        }
      }
    );
  } else {
    res.redirect("/login");
  }
});

app.post("/delete/:id", function (req, res) {
  var id = req.params.id;

  mysqlConnection.query(
    "DELETE FROM student_information WHERE StudentId =" + id,
    function (err, result) {
      if (err) {
        console.log(err);
      } else {
        mysqlConnection.query(
          "DELETE FROM logininfo WHERE ID =" + id,
          function (err, result) {
            if (err) {
              console.log(err);
            }
          }
        );
        res.redirect("/adminstudentinfo");
      }
    }
  );
});

app.post("/update/:user", function (req, res) {
  var user = req.params.user;
  var FirstName = req.body.FirstName;
  var LastName = req.body.LastName;
  var Username = req.body.Username;
  var Birthday = req.body.Birthday;
  var GuardianName = req.body.GuardianName;
  var MobileNumber = req.body.MobileNumber;
  var School = req.body.School;
  var Grade = req.body.Grade;

  //console.log(req);

  mysqlConnection.query(
    "UPDATE student_information SET FirstName='" +
      FirstName +
      "',LastName='" +
      LastName +
      "',Username='" +
      Username +
      "',Birthday='" +
      Birthday +
      "',GuardianName='" +
      GuardianName +
      "',MobileNumber='" +
      MobileNumber +
      "',School='" +
      School +
      "',Grade='" +
      Grade +
      "'  WHERE Username='" +
      user +
      "'",
    function (err, results) {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/adminstudentinfo");
      }
    }
  );
});

app.get("/payform", function (req, res) {
  if (req.session.loggedin && req.session.username === "Admin") {
    mysqlConnection.query(
      "SELECT * FROM student_information ",
      function (err, result) {
        if (err) {
          console.log(err);
        } else {
          res.render("payform", {
            studentinfo: result,
            message: "",
            error: "",
          });
        }
      }
    );
  } else {
    res.redirect("/login");
  }
});

app.post("/payform", function (req, res) {
  var username = req.body.username;
  var amount = req.body.amount;
  var year = req.body.year;
  var month1 = req.body.month;

  var date = year + "-" + month1;

  if (username && month1 && year && amount) {
    mysqlConnection.query(
      "SELECT StudentId FROM student_information where UserName='" +
        username +
        "'",
      function (err, result1) {
        if (err) {
          console.log(err);
        } else {
          console.log(result1);
          mysqlConnection.query(
            "Insert into payments (Amount,Month,StudentId) VALUES ('" +
              amount +
              "','" +
              date +
              "'," +
              result1[0].StudentId +
              ")",
            function (err, result2) {
              if (err) {
                console.log(err);
              } else {
                mysqlConnection.query(
                  "SELECT * FROM student_information ",
                  function (err, result) {
                    if (err) {
                      console.log(err);
                    } else {
                      res.render("payform", {
                        studentinfo: result,
                        error: "",
                        message:
                          username +
                          "'s fees( " +
                          amount +
                          " rupees ) for " +
                          date +
                          " added",
                      });
                    }
                  }
                );
              }
            }
          );
        }
      }
    );
  } else {
    mysqlConnection.query(
      "SELECT * FROM student_information ",
      function (err, result) {
        if (err) {
          console.log(err);
        } else {
          res.render("payform", {
            studentinfo: result,
            message: "",
            error: "Please fill all the inputs",
          });
        }
      }
    );
  }
});

app.get("/paymentinfo", function (req, res) {
  if (req.session.loggedin && req.session.username === "Admin") {
    mysqlConnection.query(
      "SELECT payments.PaymentId,payments.Month,payments.Amount,student_information.FirstName,student_information.LastName FROM payments INNER JOIN student_information ON payments.StudentId=student_information.StudentId",
      function (err, result) {
        if (err) {
          console.log(err);
        } else {
          // console.log(result);
          res.render("paymentinfo", { paymentinfo: result });
        }
      }
    );
  } else {
    res.redirect("/login");
  }
});

app.get("/monthlypayments", function (req, res) {
  if (req.session.loggedin && req.session.username === "Admin") {
    res.render("monthlypayments");
  } else {
    res.redirect("/login");
  }
});

app.post("/month", function (req, res) {
  var year = req.body.year;
  var month = req.body.month;

  var date = year + "-" + month;

  mysqlConnection.query(
    "SELECT FirstName,MobileNumber,Grade FROM student_information WHERE StudentId not in (SELECT DISTINCT StudentId FROM payments WHERE Month='" +
      date +
      "' )",
    function (err, result) {
      if (err) {
        console.log(err);
      } else {
        res.render("monthlypayments", {
          studentpayinfo: result,
          selectedmonth: date,
        });
      }
    }
  );
});

app.post("/notify/:firstName/:number/:month", function (req, res) {
  var mobileNumber = req.params.number;
  var month = req.params.month;
  var firstName = req.params.firstName;

  var id = 94717259339;
  var pw = 4714;
  var message =
    "This%20message%20is%20from%20ORACLE.%20This%20is%20to%20inform%20you%20that%20your%20child%2C%20%20" +
    firstName +
    "%20has%20an%20outstanding%20monthly%20fee%20for%20" +
    month +
    ".";

  var url =
    "http://www.textit.biz/sendmsg?id=" +
    id +
    "&pw=" +
    pw +
    "&to=" +
    mobileNumber +
    "&text=" +
    message;

  var config = {};
  if (mobileNumber && month && firstName) {
    // axios.post(url, config).then(function (response) {
    //   console.log(response.data);
    //   console.log(response.status);
    //   console.log(response.statusText);
    //   console.log(response.headers);
    //   console.log(response.config);
    // });
    res.send('Message is successfully sent to:'+ mobileNumber);
  }
});

app.get("/logout", function (req, res) {
  // req.session.currentUser = null;
  req.session.destroy();
  res.redirect("/home");
});

app.listen("3000", function () {
  console.log("Connected");
});
