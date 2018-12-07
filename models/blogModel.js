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
  likes: Number,
  image: String,
  comments: [
    {
      username: String,
      body: String,
      date: Date
    }
  ],
  recentPosts: [
    {
      title: String,
      image: String,
      date: Date
    }
  ]
});

const Blog = mongoose.model("blogs", blogPostSchema);

module.exports = Blog;
