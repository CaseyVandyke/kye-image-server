"use strict";

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const User = require("./usersModel");

//schema
const blogPostSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  author: {
    type: mongoose.Schema.Types.Mixed,
    ref: "user"
  },
  likes: Number,
  image: String,
  comments: {
    body: String,
    date: Date,
    username: String
  }
});

const Blog = mongoose.model("blogs", blogPostSchema);

module.exports = Blog;
