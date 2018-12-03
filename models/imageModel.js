"use strict";

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const User = require("./usersModel");

const imageSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title field is required"]
  },
  img: {
    type: String,
    required: [true, "Image field is required"]
  },
  author: {
    type: mongoose.Schema.Types.Mixed,
    ref: "users"
  }
});

const adminImage = mongoose.model("images", imageSchema);

module.exports = adminImage;
