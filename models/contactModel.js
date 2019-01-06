"use strict";

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const User = require("./usersModel");

const contactSchema = {
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    require: true
  },
  phone: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  }
};

const Contact = mongoose.model("contact", contactSchema);

module.exports = Contact;
