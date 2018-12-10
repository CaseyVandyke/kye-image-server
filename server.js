"use strict";

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const { DATABASE_URL, PORT } = require("./config");
const User = require("./models/usersModel");
const Blog = require("./models/blogModel");
const Comments = require("./models/commentsModel");
const { router: userRouter } = require("./routers/userRouter");
const { router: blogRouter } = require("./routers/blogRouter");
const { router: commentsRouter } = require("./routers/commentsRouter");
const { router: router, localStrategy, jwtStrategy } = require("./auth");

app.use(express.static("public"));
app.use(bodyParser.json());

// initialize routes
passport.use(localStrategy);
passport.use(jwtStrategy);

app.use("/api", userRouter);
app.use("/api", blogRouter);
app.use("/api", commentsRouter);
app.use("/api/auth", router);

const jwtAuth = passport.authenticate("jwt", { session: false });
// A protected endpoint which needs a valid JWT to access it
app.get("/api/protected", jwtAuth, (req, res) => {
  console.log(req);
  return res.json({
    username: req.user.username
  });
});
//error handling middleware
app.use("*", (err, req, res, next) => {
  // console.log(err);
  res.status(422).send({ error: err.message });
});

app.get("/", function(req, res, next) {
  res.send("Hello world");
});

let server;
// this function connects to our database, then starts the server
function runServer(databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(
      databaseUrl,
      { useNewUrlParser: true },
      err => {
        if (err) {
          return reject(err);
        }
        server = app
          .listen(port, () => {
            console.log(`Your app is listening on port ${port}`);
            resolve();
          })
          .on("error", err => {
            mongoose.disconnect();
            reject(err);
          });
      }
    );
  });
}

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log("Closing server");
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };
