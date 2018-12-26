"use strict";

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
mongoose.Promise = global.Promise;

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  isAdmin: {
    type: String,
    default: false
  }
});

UserSchema.methods.serialize = function() {
  return {
    email: this.email || "",
    id: this._id || "",
    isAdmin: this.isAdmin || ""
  };
};

UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};

const User = mongoose.model("users", UserSchema);

module.exports = User;
