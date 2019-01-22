const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const Image = require("../models/imgModel");

// Endpoint
router.get("/uploads", (req, res, next) => {
  Image.find().then(arrayOfImages => {
    res.status(200).json(arrayOfImages);
  });
});

module.exports = {
  router
};
