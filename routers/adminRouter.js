"use strict";

const express = require("express");
const User = require("../models/usersModel");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const jwtAuth = passport.authenticate("jwt", { session: false });
const bcrypt = require("bcrypt");

// Load Input Validation
const validateRegisterInput = require("../validation/register");

// Get all users
router.get("/admin", (req, res, next) => {
  User.find({})
    .then(users => {
      res.json(users);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: "something went wrong"
      });
    });
});

// @CREATE NEW ADMIN
router.post("/admin", jsonParser, (req, res) => {
  console.log("/users email=", req.body.email);
  const { errors, isValid } = validateRegisterInput(req.body);
  console.log("------");

  // Check validation
  if (!isValid) {
    return res.status(401).json(errors);
  }
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "Email already exists";
      return res.status(402).json(errors);
    } else {
      const newUser = new User({
        email: req.body.email,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => {
              return res.status(403).json(err);
            });
        });
      });
    }
  });
});

//Update user
router.put("/admin/:id", (req, res) => {
  //Make sure there is an id in req.params & req.body and make sure they match
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    return res.status(400).json({
      error: "Request path id and request body id values must match"
    });
  }

  const updated = {};
  const updateableFields = ["email", "password"];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });

  User.findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
    .then(updatedUser => {
      res.status(200).json({
        message: "You successfully updated your user info."
      });
    })
    .catch(err => {
      res.status(500).json({
        message: "There is an error with updating your user info."
      });
    });
});

//delete user by id
router.delete("/admin/:id", (req, res) => {
  User.findByIdAndRemove(req.params.id).then(() => {
    console.log(`Deleted user with id \`${req.params.id}\``);
    return res.status(200).json({
      message: "Your user was successfully deleted",
      post: req.params.id
    });
  });
});

module.exports = {
  router
};
