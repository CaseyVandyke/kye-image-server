const express = require("express");
const router = express.Router();
const Blog = require("../models/blogModel");
const passport = require("passport");
const jwtAuth = passport.authenticate("jwt", { session: false });
const passportAuth = passport.authenticate("jwt", { session: false });
const User = require("../models/usersModel");

//get all posts
//works
router.get("/posts", (req, res) => {
  let increaseLimit = 10;

  Blog.find()
    .sort({ date: -1 })
    .limit(Number(increaseLimit))
    .then(posts => {
      res.json(posts);
    })
    .catch(err => {
      res.status(500).json({
        error: err.message
      });
    });
});

//create new post
//works
router.post("/blog/posts", passportAuth, (req, res) => {
  if (req.user.isAdmin == "true") {
    const payload = {
      title: req.body.title,
      body: req.body.body,
      comments: req.body.comments,
      image: req.body.image,
      recentPosts: req.body.recentPosts
    };

    Blog.create(payload).then(newPost => res.status(201).json(newPost));
  } else {
    res.status(500).json({
      error: "Unauthorized user"
    });
  }
});

// works
router.put("/posts/:id", (req, res) => {
  const updated = {};
  const updateableFields = [
    "title",
    "body",
    "comments",
    "image",
    "recentPosts"
  ];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });

  Blog.findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
    .then(updatedPost => {
      res.status(200).json({
        message: "You successfully updated your post."
      });
    })
    .catch(err => {
      res.status(500).json({
        message: "There is an error with updating your post."
      });
    });
});

// works
router.delete("/posts/:id", (req, res) => {
  Blog.findByIdAndRemove(req.params.id).then(() => {
    console.log(`Deleted post with id \`${req.params.id}\``);
    return res.status(200).json({
      message: "Your post was successfully deleted",
      post: req.params.id
    });
  });
});

module.exports = {
  router
};
