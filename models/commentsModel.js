"use strict";

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const User = require("./usersModel");

const commentSchema = mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.Mixed,
    ref: "user"
  },
  comment: {
    type: String
  },
  date: {
    type: Date
  }
});

const Comments = mongoose.model("comments", commentSchema);

module.exports = Comments;
