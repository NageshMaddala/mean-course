//code for signup and login routes backend code
const express = require("express");
const bcrypt = require("bcrypt");

const User = require("../models/user");

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

});


module.exports = router;
