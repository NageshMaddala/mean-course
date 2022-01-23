//code for signup and login routes backend code
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const user = require("../models/user");

const router = express.Router();

//Note: don't save the raw password for the security reasons
// encrypt or hash it before saving the password to the database
// npm install --save bcrypt
// bcrypt packages does that for us

router.post("/signup", (req, res, next) => {
  //hash the password
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save()
        .then(result => {
          res.status(201).json({
            message: 'User created!',
            result: result
          });
        })
        .catch(err => {
          res.status(500).json({
            error: err
          });
        });
    });
});

router.post("/login", (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email }).then(user => {
    if (!user) {
      console.log(user);
      return res.status(401).json({
        message: "Auth failed"
      });
    }
    fetchedUser = user;
    //found user with email address
    //now compare the pwd
    return bcrypt.compare(req.body.password, user.password);
  }).then(result => {
    if (!result) {
      return res.status(401).json({
        message: "Auth failed"
      });
    }
    //valid pwd
    //create json webtoken
    //jwt.io read more about that
    //below line creates token
    const token = jwt.sign({ email: fetchedUser.email, userId: fetchedUser._Id }, 'secret_this_should_be_longer',
      { expiresIn: "1h" });
    res.status(200).json({
      token: token,
      // 3600 seconds
      expiresIn: 3600
    });

  }).catch(err => {
    console.log(err);
    return res.status(401).json({
      message: "Auth failed"
    });
  });
});


module.exports = router;
