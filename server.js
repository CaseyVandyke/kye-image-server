"use strict";

const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const passport = require("passport");

const { DATABASE_URL, PORT, CLIENT_ORIGIN } = require("./config");
const { router: userRouter } = require("./routers/userRouter");
const { router: blogRouter } = require("./routers/blogRouter");
const { router: commentsRouter } = require("./routers/commentsRouter");
const { router: contactRouter } = require("./routers/contactRouter");
const { router: router, localStrategy, jwtStrategy } = require("./auth");

// Set storage engine
const storage = multer.diskStorage({
  destination: "./public/uploads",
  filename: function(req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  }
});

// Init upload
const upload = multer({
  storage: storage
}).single("myImage");

let server;
const app = express();

// Middleware
app.use(morgan("common"));
app.use(express.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  if (req.method === "OPTIONS") {
    return res.send(204);
  }
  next();
});

// Used when authenticating user login
passport.use(localStrategy);
passport.use(jwtStrategy);

app.use("/api", userRouter);
app.use("/api", blogRouter);
app.use("/api", commentsRouter);
app.use("/api", contactRouter);
app.use("/api/auth", router);

// Public folder
app.use(express.static("./public"));

app.use("*", (req, res) => {
  return res.status(404).json({ message: "Not Found" });
});

const jwtAuth = passport.authenticate("jwt", { session: false });
// A protected endpoint which needs a valid JWT to access it
app.get("/api/*", jwtAuth, (req, res) => {
  console.log(req);
  return res.json({
    email: req.user.email
  });
});

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
