"use strict";
const express = require("express");
const User = require("../models/usersModel");
const passport = require("passport");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const config = require("../config");
const router = express.Router();
// Load Input Validation
const validateLoginInput = require("../validation/login");

router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then(user => {
    // Check for user
    if (!user) {
      errors.email = "User not found";
      return res.status(404).json(errors);
    }

    // Check Password
    bcrypt.compare(password, user.password).then(isMatch => {
      console.log(config.JWT_SECRET);
      if (isMatch) {
        // User Matched
        const payload = { id: user.id, firstName: user.firstName }; // Create JWT Payload

        // Sign Token
        jwt.sign(
          payload,
          config.JWT_SECRET,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        errors.password = "Password incorrect";
        return res.status(400).json(errors);
      }
    });
  });
});

module.exports = { router };
