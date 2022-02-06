const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const user = require("../models/user");

exports.createUser = (req, res, next) => {
  console.log(req.body.email);
  //hash the password
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save()
        .then(result => {
          console.log('User successfully created!');
          res.status(201).json({
            message: 'User created!',
            result: result
          });
        })
        .catch(err => {
          // res.status(500).json({
          //   error: err
          // });
          // we can customize the error object returned back to client
          res.status(500).json({
            message: "Invalid authentication credentials!"
          });
        });
    });
}

exports.userLogin = (req, res, next) => {
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
    const token = jwt.sign({ email: fetchedUser.email, userId: fetchedUser._id },
      // 'secret_this_should_be_longer',
      // nodejs maintains a process which contains
      // all the information about the environment variables
      // config that was injected into the app, here it's the whole
      // config from nodemon.json file
      process.env.JWT_KEY,
      { expiresIn: "1h" });
    res.status(200).json({
      token: token,
      // 3600 seconds
      expiresIn: 3600,
      userId: fetchedUser._id
    });

  }).catch(err => {
    console.log(err);
    return res.status(401).json({
      message: "Invalid authentication credentials!"
    });
  });
}
