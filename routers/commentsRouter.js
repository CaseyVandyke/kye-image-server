"use strict";

const express = require("express");
const router = express.Router();
const Comments = require("../models/commentsModel");
const passport = require("passport");
const User = require("../models/usersModel");

const jwtAuth = passport.authenticate("jwt", { session: false });

//for every endpoint check if user or admin.
// use imageModel for endpoints but check to see
// if admin then carry out instructions.

module.exports = {
  router
};
