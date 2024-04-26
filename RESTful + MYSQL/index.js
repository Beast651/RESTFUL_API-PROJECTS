const { faker } = require("@faker-js/faker");
// Get the client
const mysql = require("mysql2");
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const { v4: uuidv4 } = require("uuid");

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

// Create the connection to database
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Your_Password",
  database: "delta_app",
});

let getRandomUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.userName(),
    faker.internet.email(),
    faker.internet.password(),
  ];
};

// HOME ROUTE
app.get("/", (req, res) => {
  console.log("started working");
  let q = "SELECT count(*) FROM user";
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;

      let cnt = result[0]["count(*)"];
      res.render("home.ejs", { cnt });
    });
  } catch (error) {
    console.log(error);
  }
});

// SHOW ROUTE

app.get("/user", (req, res) => {
  let q = "SELECT * FROM user";
  try {
    connection.query(q, (err, users) => {
      if (err) throw err;
      res.render("show.ejs", { users });
    });
  } catch (error) {
    console.log(error);
  }
});

// Edit Route

app.get("/user/:id/edit", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM user WHERE id = '${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      res.render("edit.ejs", { user });
      // res.render("new.ejs");
    });
  } catch (error) {
    console.log(error);
  }
});

// Update Route

app.patch("/user/:id", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM user WHERE id = '${id}'`;
  let { password: formPass, username: newUsername } = req.body;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      if (formPass != user.password) {
        res.send("Wrong Password");
      } else {
        let q2 = `UPDATE user SET username = '${newUsername}' WHERE id = '${id}'`;
        connection.query(q2, (err, result) => {
          if (err) throw err;
          res.send(result);
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
});

// Add Route

app.get("/user/add", (req, res) => {
  res.render("new.ejs");
});

// Push the New Data and added into database

app.post("/user", (req, res) => {
  let id = uuidv4();
  let { username: newUsername, email: gmail, password: pass } = req.body;
  // console.log(id);
  let q = `INSERT INTO user VALUES ("${id}","${newUsername}","${gmail}","${pass}");`;
  console.log(q);

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      console.log(result);
      res.redirect("/user");
    });
  } catch (err) {
    console.log(err);
  }
});

// Delete Route
app.get("/user/:id/del", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM user WHERE id = '${id}'`;

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      console.log(result);
      let user = result[0];
      res.render("del.ejs", { user });
    });
  } catch (err) {
    console.log(err);
  }
});

// Remove the data from the database:

app.delete("/user/:id", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM user WHERE id = '${id}'`;
  let { password: formPass } = req.body;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      if (formPass != user.password) {
        res.send("Wrong Password");
      } else {
        let q2 = `DELETE FROM user WHERE id = '${id}'`;
        connection.query(q2, (err, result) => {
          if (err) throw err;
          res.redirect("/user");
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

app.listen("8080", () => {
  console.log("server is listening");
});
