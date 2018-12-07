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
//works
router.get("/comments", jwtAuth, (req, res, next) => {
  Comments.find()
    .then(comment => {
      res.send(comment);
    })
    .catch(function(err) {
      res.status(500).json({
        error: "something went wrong"
      });
    });
});

//works
router.post("/comments", jwtAuth, (req, res, next) => {
  const payload = {
    title: req.body.title,
    comment: req.body.comment
  };

  Comments.create(payload)
    .then(newComment => res.status(201).json(newComment))
    .catch(err => {
      error: err.message;
    });
});

//works
router.put("/comments/:id", jwtAuth, (req, res, next) => {
  const updated = {};
  const updateableFields = ["title", "comment"];

  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });

  Comments.findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
    .then(updatedPost => {
      res.status(200).json({
        message: "You successfully updated your comment."
      });
    })
    .catch(err => {
      res.status(500).json({
        message: "There is an error with updating your comment."
      });
    });
});

// works
router.delete("/comments/:id", jwtAuth, (req, res) => {
  Comments.findByIdAndRemove(req.params.id).then(() => {
    console.log(`Deleted comment with id \`${req.params.id}\``);
    return res.status(200).json({
      message: "Your comment was successfully deleted",
      post: req.params.id
    });
  });
});

module.exports = {
  router
};
