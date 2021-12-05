// download express package
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const postsRoutes = require("./routes/posts");
//lets us access path or directory on server or os
const path = require("path");

mongoose.connect("mongodb+srv://mean-sample:tgzo5cum7NS8hh48@cluster0.rfnda.mongodb.net/node-angular?retryWrites=true&w=majority")
  .then(() => {
    console.log('Connected to database!');
  })
  .catch((e) => {
    console.log(e);
    console.log('Connection failed!');
  });

//Learn node from here
//https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs

//create express app
const app = express();

// returns json data
// added this infront of CORS
app.use(bodyParser.json());

// url encoding, bodyparser is capable of doing that
// but not required for this excersise
app.use(bodyParser.urlencoded({ extended: false }));
// any request accessing images directory will be allowed
// when marked with express.static()
// requests coming to images will be forwarded to backend/images
app.use("/images", express.static(path.join("backend/images")));

//cors middleware,
//adding headers to fix the cors issue
app.use((req, res, next) => {
  //allows which domains to access our resources
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST, PATCH, PUT, DELETE, OPTIONS");
  console.log("CORS have been set");
  next();
});

//this will do the trick of routing to the requests to router
app.use("/api/posts", postsRoutes);

module.exports = app;
