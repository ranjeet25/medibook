const express = require("express");
const path = require("path");
const app = express();
const port = 5000;
const mysql = require("mysql");
var cookieParser = require("cookie-parser");
var session = require("express-session");

app.use(cookieParser());
app.use(
  session({
    key: "medipoint",
    secret: "its a secret!",
    saveUninitialized: true,
    resave: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("static"));

// ********************* DATABASE CONNECTION
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "medipoint",
});

// ********************* DATABASE CONNECTION VERIFICATION

db.connect((error) => {
  if (error) throw error;
  else {
    console.log("Database connected");
  }
});

// ********************* ROUTE 1 Main home page

app.get("/", (req, res) => {
  //res.send("hello");
  res.send(path.resolve("index.html"));
  res.send(path.resolve("style.css"));
  res.send(path.resolve("register.html"));
  res.send(path.resolve("login.html"));

  res.end();
});

// ********************* ROUTE 2 GETTING DATA FROM REGISTRATION FORM

app.post("/register", (req, res) => {
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.psw;
  let phone = req.body.phone;
  //   console.log(username);
  //   console.log(email);
  //   console.log(password);
  //   console.log(phone);

  db.query(
    "INSERT INTO `registration` (`sr-no`, `username`, `email`, `password`, `phone`) VALUES (?,?,?,?,?)",
    [null, username, email, password, phone],

    (err, rows, feilds) => {
      if (!err)
        //console.log(rows[0]);
        //res.send(rows);
        console.log("data entered sucessfully");
      else console.log(err);
    }
  );

  res.redirect("/login");
});

// ********************* ROUTE 3 AUTHENTICATION OF USERs ie login page

app.post("/login", (req, res) => {
  res.sendFile(__dirname + "/static/login.html");

  let username = req.body.username;
  let email = "sawranjeet@gmail.com";
  let pass = "abc";
  req.session.email = req.body.email;
  req.session.pass = req.body.psw;

  //console.log(email);
  //console.log(pass);

  if (req.session.email == email && req.session.pass == pass) {
    if (email && pass.length > 0) {
      // Authenticate the user
      // req.session.loggedin = true;
      // req.sessionID;

      // let suser = (req.session.username = email);
      // console.log(suser);
      // let passw = (req.session.psw = pass);
      // console.log(passw);
      // let sid = req.sessionID;
      // console.log(sid);
      //Redirect to dashboard page
      res.redirect("/dashboard");
    } else {
      res.send("Incorrect Username and/or Password!");
    }
  } else {
    res.send("Please enter VALID login information");
  }

  // if ((email == demail) & (pass == dpass)) {
  //   console.log("user identified");
  // } else {
  //   console.log("email or password is incorrect");
  // }
  //res.redirect("/dashboard");
});

// ********************* ROUTE 4 Creating a session ie. Dashboard

app.get("/dashboard", (req, res) => {
  res.sendFile(__dirname + "/static/dashboard.html");
});

// ********************* ROUTE 5 booking_details

app.post("/booking", (req, res) => {
  res.sendFile(__dirname + "/static/booking.html");

  let pname = req.body.name;
  let page = req.body.age;
  let pphone = req.body.phone;
  let plocation = req.body.location;
  let pdrcode = req.body.drcode;
  let pdate = req.body.date;
  let ptime = req.body.time;

  db.query(
    "INSERT INTO `booking_details` (`sr-no`,`name`, `age`, `phone`, `location`, `drcode`, `date`, `time`) VALUES (?,?, ?, ?, ?, ?, ?, ?)",
    [null, pname, page, pphone, plocation, pdrcode, pdate, ptime],

    (err, rows, feilds) => {
      if (!err) {
        //console.log(rows[0]);
        //res.send(rows);
        console.log("data entered sucessfully");
      } else {
        console.log(err);
      }
    }
  );
});

// ********************* ROUTE 5 booking_History

app.get("/booking-history", (req, res) => {
  db.query("SELECT * FROM `booking_details`", (err, rows, feilds) => {
    if (!err)
      //console.log(rows[0].patient_id);
      res.send(rows.slice(-1));
    else console.log(err);
  });
});

// ********************* ROUTE 6 LOGOUT

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

app.listen(port, () => {
  console.log("server listining at port " + port);
});
