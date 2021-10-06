var express = require("express");
var router = express.Router();
var bcrypt = require('bcryptjs');
var mysqlConnection = require("../model/db");

router.get("/register", isAdminLoggedIn, function (req, res) {
  res.render("register", { error: "", success: "" });
});

router.post("/register", function (req, res) {
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var birthday = req.body.birthday;
  var guardian = req.body.guardian;
  var mobileNo = req.body.mobileNo;
  var school = req.body.school;
  var grade = req.body.grade;
  var email = req.body.email;
  var userName = req.body.username;
  var cpassword = req.body.cpassword;

  var passwordHash = bcrypt.hashSync(cpassword, 10);
  // var index = req.body.index;
  var isFilled =
    firstName &&
    lastName &&
    birthday &&
    guardian &&
    mobileNo &&
    school &&
    grade &&
    email &&
    userName &&
    cpassword;

  if (isFilled) {
    mysqlConnection.query(
      "Insert into student_information (FirstName,LastName,Birthday,GuardianName,MobileNumber,School,Grade,Username,Email) VALUES ('" +
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
        userName +
        "','" +
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
              userName +
              "','" +
              passwordHash +
              "')",
            function (err, result) {
              if (err) {
                console.log(err);
              } else {
                res.render("register", {
                  success: "Student is registered : " + userName +" - "+ email,
                  error: "",
                });
              }
            }
          );
        }
      }
    );
  }
});

router.get("/adminstudentinfo", isAdminLoggedIn, function (req, res) {
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
});

router.post("/delete/:id", function (req, res) {
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

router.post("/update/:id", function (req, res) {
  var StudentId = req.params.id;
  var FirstName = req.body.FirstName;
  var LastName = req.body.LastName;
  var Username = req.body.Username;
  var Birthday = req.body.Birthday;
  var GuardianName = req.body.GuardianName;
  var MobileNumber = req.body.MobileNumber;
  var School = req.body.School;
  var Grade = req.body.Grade;
  var Email = req.body.Email;

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
      "',Email='" +
      Email +
      "'  WHERE StudentId='" +
      StudentId +
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

function isAdminLoggedIn(req, res, next) {
  if (req.session.loggedin && req.session.username === "Admin") {
    return next();
  } else {
    res.redirect("/login");
  }
}

module.exports = router;
