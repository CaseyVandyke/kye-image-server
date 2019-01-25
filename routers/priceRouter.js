const Price = require("../models/pricingModel");
const User = require("../models/usersModel");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const express = require("express");
const router = express.Router();

router.get("/pricing", (req, res, next) => {
  Price.find().then(arr => {
    res.status(200).json({
      families: arr[0].families,
      extended: arr[0].extended,
      packageA: arr[0].packageA,
      packageB: arr[0].packageB,
      packageC: arr[0].packageC,
      newborn: arr[0].newborn,
      senior: arr[0].senior,
      maternity: arr[0].maternity
    });
  });
});

router.post("/pricing", jsonParser, (req, res, next) => {
  payload = {
    families: req.body.families,
    extended: req.body.extended,
    packageA: req.body.packageA,
    packageB: req.body.packageB,
    packageC: req.body.packageC,
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
    "extended",
    "packageA",
    "packageB",
    "packageC",
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
