"use strict";

module.exports = {
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || "http://localhost:3000",
  DATABASE_URL:
    process.env.DATABASE_URL ||
    "mongodb://Casey:Mindy101!@ds135714.mlab.com:35714/kye-image",
  TEST_DATABASE_URL:
    process.env.TEST_DATABASE_URL || "mongodb://localhost/test_kye_image_db",
  PORT: process.env.PORT || 8080,
  JWT_SECRET: process.env.JWT_SECRET || "secret",
  JWT_EXPIRY: process.env.JWT_EXPIRY || "7d"
};
