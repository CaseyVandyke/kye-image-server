"use strict";
const chai = require("chai");
const chaiHttp = require("chai-http");
const faker = require("faker");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
// this makes the should syntax available throughout this module
const should = require("chai").should();
const expect = chai.expect;
const User = require("../models/usersModel");
const Blog = require("../models/blogModel");
const { closeServer, runServer, app } = require("../server");
const { TEST_DATABASE_URL, JWT_SECRET } = require("../config");
chai.use(chaiHttp);
// this function deletes the entire database.
// we'll call it in an `afterEach` block below
// to ensure  data from one test does not stick
// around for next one
function tearDownDb() {
  return new Promise((resolve, reject) => {
    console.warn("Deleting database");
    mongoose.connection
      .dropDatabase()
      .then(result => resolve(result))
      .catch(err => reject(err));
  });
}
const username = faker.internet.userName();
const password = faker.internet.password();
describe("Blog API resource", function() {
  before(function() {
    runServer(TEST_DATABASE_URL);
    return User.hashPassword(password).then(password => {
      User.create({ username, password }).then(userData => {
        let newBlog = {
          title: faker.lorem.text(),
          body: faker.lorem.text(),
          date: faker.date.recent(),
          author: userData.username,
          image: faker.image.image(),
          comments: faker.lorem.text()
        };
        Blog.create(newBlog);
      });
    });
  });
  beforeEach(function() {});
  afterEach(function() {
    // tear down database so we ensure no state from this test
    // effects any coming after.
  });
  after(function() {
    tearDownDb();
    return closeServer();
  });

  describe("GET endpoint", function() {
    it("should return all existing blogs", function() {
      // strategy:
      //    1. get back all diets returned by GET request to `/posts`
      //    2. prove res has right status, data type
      //    3. prove the number of posts we got back is equal to number
      //       in db.
      let res;
      var token = jwt.sign(
        {
          username,
          password
        },
        JWT_SECRET,
        {
          algorithm: "HS256",
          subject: username,
          expiresIn: "7d"
        }
      );

      User.find({ username: username }).then(users => {
        return chai
          .request(app)
          .get("/api/posts")
          .set("Content-Type", "application/json")
          .set("Accept", "application/json")
          .set("Authorization", `Bearer ${token}`)
          .send(newBlog)
          .then(_res => {
            res = _res;
            res.should.have.status(200);
            // otherwise our db seeding didn't work
            res.body.should.have.lengthOf.at.least(1);
            return Blog.count();
          })
          .then(count => {
            // the number of returned posts should be same
            // as number of posts in DB
            res.body.should.have.lengthOf(count);
          });
      });
    });
  });

  it("should return blogs with right fields", function() {
    // Strategy: Get back all diets, and ensure they have expected keys
    let res;
    var token = jwt.sign(
      {
        username,
        password
      },
      JWT_SECRET,
      {
        algorithm: "HS256",
        subject: username,
        expiresIn: "7d"
      }
    );

    User.find({ username: username }).then(users => {
      return chai
        .request(app)
        .get("/api/posts")
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .then(function(res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("array");
          res.body.should.have.lengthOf.at.least(1);
          res.body.forEach(function(dietPost) {
            dietPost.should.be.a("object");
            dietPost.should.include.keys(
              "title",
              "body",
              "date",
              "author",
              "image",
              "comments"
            );
          });
          // just check one of the posts that its values match with those in db
          // and we'll assume it's true for rest
          resBlog = res.body[0];
          return Blog.findById(resBlog._id);
        })
        .then(blog => {
          resBlog.title.should.equal(blog.title);
          resBlog.body.should.equal(blog.body);
          resBlog.date.should.equal(blog.date);
          resBlog.author.should.equal(blog.author);
          resBlog.image.should.equal(blog.image);
          resBlog.comments.should.equal(blog.comments);
        });
    });
  });

  describe("POST endpoint", function() {
    // strategy: make a POST request with data,
    // then prove that the post we get back has
    // right keys, and that `id` is there (which means
    // the data was inserted into db)
    it("should add a new blog", function() {
      let res;
      var token = jwt.sign(
        {
          username,
          password
        },
        JWT_SECRET,
        {
          algorithm: "HS256",
          subject: username,
          expiresIn: "7d"
        }
      );

      User.find({ username: username }).then(users => {
        return chai
          .request(app)
          .post("/api/posts")
          .set("Content-Type", "application/json")
          .set("Accept", "application/json")
          .set("Authorization", `Bearer ${token}`)
          .send(newBlog)
          .then(function(res) {
            res.should.have.status(200);
            res.should.be.json;
            console.log(res.body);
            res.body.should.be.a("object");
            res.body.should.include.keys(
              "title",
              "body",
              "date",
              "author",
              "image",
              "comments"
            );
            res.body.title.should.equal(newBlog.title);
            // cause Mongo should have created id on insertion
            res.body._id.should.not.equal(null);
            return Blog.findById(res.body._id);
          })
          .then(blog => {
            blog.title.should.not.equal(null);
            blog.body.should.not.equal(null);
            blog.date.should.not.equal(null);
            blog.author.should.not.equal(null);
            blog.image.should.not.equal(null);
            blog.comments.should.not.equal(null);
          });
      });
    });
  });

  describe("diet PUT request", function() {
    it("should update fields sent", function() {
      let res;
      var token = jwt.sign(
        {
          username,
          password
        },
        JWT_SECRET,
        {
          algorithm: "HS256",
          subject: username,
          expiresIn: "7d"
        }
      );

      User.find({ username: username }).then(users => {
        Blog.findOne()
          .then(entry => {
            updateBlog.id = entry.id;
            return chai
              .request(app)
              .put(`/api/posts/${entry.id}`)
              .set("Content-Type", "application/json")
              .set("Accept", "application/json")
              .set("Authorization", `Bearer ${token}`)
              .send(updateBlog);
          })
          .then(function(res) {
            expect(res).to.have.status(200);
            return Blog.findById(updateBlog.id);
          })
          .then(blog => {
            blog.title.should.not.equal(null);
            blog.body.should.not.equal(null);
            blog.date.should.not.equal(null);
            blog.author.should.not.equal(null);
            blog.image.should.not.equal(null);
            blog.comments.should.not.equal(null);
          });
      });
    });
  });

  describe("Diet DELETE endpoint", function() {
    it("should delete a blog by id", function() {
      let res;
      var token = jwt.sign(
        {
          username,
          password
        },
        JWT_SECRET,
        {
          algorithm: "HS256",
          subject: username,
          expiresIn: "7d"
        }
      );

      User.find({ username: username }).then(users => {
        Diet.findOne()
          .then(_post => {
            deletedBlog = _post;
            return chai
              .request(app)
              .delete(`/api/posts/${deletedBlog._id}`)
              .set("Content-Type", "application/json")
              .set("Accept", "application/json")
              .set("Authorization", `Bearer ${token}`);
          })
          .then(res => {
            res.should.have.status(200);
            return Diet.findById(deletedBlog._id);
          })
          .then(post => {
            should.not.exist(post);
          });
      });
    });
  });
});
