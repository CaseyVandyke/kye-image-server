"use strict";

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const imageSchema = mongoose.Schema({
  title: String,
  date: {
    type: Date,
    default: Date.now
  },
  image: String,
  info: String
});

const Image = mongoose.model("image", imageSchema);

module.exports = Image;
