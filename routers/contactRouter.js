const express = require("express");
const router = express.Router();
const passport = require("passport");
const Contact = require("../models/contactModel");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const jsonParser = bodyParser.json();
const jwtAuth = passport.authenticate("jwt", { session: false });
const passportAuth = passport.authenticate("jwt", { session: false });
const User = require("../models/usersModel");

// Load contact validation
const validateContactInput = require("../validation/contact");

router.get("/contact", (req, res, next) => {
  Contact.find({})
    .then(contacts => {
      res.json(contacts);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: "something went wrong"
      });
    });
});

// Create contact message
router.post("/contact", jsonParser, (req, res) => {
  const { errors, isValid } = validateContactInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  // Not finished
});

module.exports = {
  router
};
