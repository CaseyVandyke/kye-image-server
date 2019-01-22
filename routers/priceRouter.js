const Price = require("../models/pricingModel");
const User = require("../models/usersModel");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const express = require("express");
const router = express.Router();

router.get("/pricing", (req, res, next) => {
  Price.find().then(arr => {
    res.status(200).json({
      families: arr[0].families
    });
  });
});

router.post("/pricing", jsonParser, (req, res, next) => {
  payload = {
    families: req.body.families,
    wedding: req.body.wedding,
    newborn: req.body.newborn,
    senior: req.body.senior,
    maternity: req.body.maternity
  };
  Price.create(payload)
    .then(newPrice => res.status(201).json(newPrice))
    .catch(err => {
      res.status(500).json({
        error: "Unauthorized user"
      });
    });
});

router.put("/pricing/:id", (req, res, next) => {
  const updated = {};
  const updateableFields = [
    "families",
    "wedding",
    "newborn",
    "senior",
    "maternity"
  ];

  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });
  Price.findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
    .then(updatedPrice => {
      res.status(200).json({
        message: "You successfully updated your price."
      });
    })
    .catch(err => {
      res.status(500).json({
        message: "There is an error with updating your price."
      });
    });
});

router.delete("/pricing/:id", (req, res, next) => {
  Price.findByIdAndDelete(req.params.id).then(() => {
    console.log(`Deleted price with id \`${req.params.id}\``);
    return res.status(200).json({
      message: "Your price was successfully deleted",
      post: req.params.id
    });
  });
});

module.exports = {
  router
};
