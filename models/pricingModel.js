"use-strict";

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const priceSchema = mongoose.Schema({
  families: String,
  wedding: String,
  newborn: String,
  senior: String,
  maternity: String
});

const Price = mongoose.model("price", priceSchema);

module.exports = Price;
