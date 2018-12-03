"use strict";

const express = require("express");
const router = express.Router();
const adminImage = require("../models/imageModel");
const passport = require("passport");

const jwtAuth = passport.authenticate("jwt", { session: false });

module.exports = {
  router
};
