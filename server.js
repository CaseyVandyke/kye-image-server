"use strict";

const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const passport = require("passport");
const Image = require("./models/imgModel");

const { DATABASE_URL, PORT, CLIENT_ORIGIN } = require("./config");
const { router: adminRouter } = require("./routers/adminRouter");
const { router: imgRouter } = require("./routers/imgRouter");
const { router: userRouter } = require("./routers/userRouter");
const { router: blogRouter } = require("./routers/blogRouter");
const { router: priceRouter } = require("./routers/priceRouter");
const { router: commentsRouter } = require("./routers/commentsRouter");
const { router: contactRouter } = require("./routers/contactRouter");
const { router: router, localStrategy, jwtStrategy } = require("./auth");

const app = express();
app.use(express.static("uploads"));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  if (req.method === "OPTIONS") {
    return res.send(204);
  }
  next();
});

// File Upload
const multer = require("multer");
const uuidv4 = require("uuid/v4");
const path = require("path");

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    /* 
        Files will be saved in the 'uploads' directory. 
        Make sure this directory already exists!
        */
    cb(null, "./uploads/images");
  },
  filename: (req, file, cb) => {
    /*
            uuidv4() will generate a random ID that we'll use for the
            new filename. We use path.extname() to get
            the extension from the original file name and add that to the new
            generated ID. These combined will create the file name used
            to save the file on the server and will be available as
            req.file.pathname in the router handler.
          */
    const newFilename = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, newFilename);
  }
});
// Create the multer instance that will be used to upload/save the file
const upload = multer({ storage });

app.post("/uploads", upload.single("selectedFile"), (req, res) => {
  const payload = {
    title: req.body.title,
    date: req.body.date,
    image: "./uploads/images" + req.file.filename,
    info: req.body.info
  };
  Image.create(payload)
    .then(newImage => res.status(201).json(newImage))
    .catch(err => {
      error: err.message;
    });
  /*
          We now have a new req.file object here. At this point the file has been saved
          and the req.file.filename value will be the name returned by the
          filename() function defined in the diskStorage configuration. Other form fields
          are available here in req.body.
        */
  console.log(req.file);
  // res.send(req.file);
});

let server;

// Middleware
app.use(morgan("common"));
app.use(express.json());

// Used when authenticating user login
passport.use(localStrategy);
passport.use(jwtStrategy);

app.use(express.static("uploads"));
app.use("/api", adminRouter);
app.use("/api", priceRouter);
app.use("/api", userRouter);
app.use("/api", blogRouter);
app.use("/api", commentsRouter);
app.use("/api", contactRouter);
app.use("/api", imgRouter);
app.use("/api/auth", router);

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
    mongoose.connect(databaseUrl, { useNewUrlParser: true }, err => {
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
    });
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
