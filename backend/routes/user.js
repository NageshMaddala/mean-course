//code for signup and login routes backend code
const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user");

//Note: don't save the raw password for the security reasons
// encrypt or hash it before saving the password to the database
// npm install --save bcrypt
// bcrypt packages does that for us

router.post("/signup", UserController.createUser);
router.post("/login", UserController.userLogin);

module.exports = router;
