// download express package
const express = require("express");
const bodyParser = require("body-parser");

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

//cors middleware,
//adding headers to fix the cors issue
app.use((req, res, next) => {
  //allows which domains to access our resources
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST, PATCH, DELETE, OPTIONS");
  console.log("CORS have been set");
  next();
});

//add middleware
// app.use((req, res, next) => {
//   console.log('First middleware');
//   //call next to pass request to the next middle ware
//   next();
// });

// app.use((req, res, next) => {
//   //send response back to caller
//   res.send('Hello from express!');
// })

//this will invoked for post requests
//like-wise app.put() for update requests,
//app.delete() and so on..
app.post("/api/posts", (req, res, next) => {
  const post = req.body;
  console.log(post);

  //still need to return 201 saying everything is good
  res.status(201).json({
    message: 'Post added successfully'
  });

  //to extract the payload coming from the request
  //install the package - body-parser which makes it easy
  //to extract the required data from the incoming request
  //npm install --save body-parser
  //it adds specialy property to incoming request

});

// basically it honors only the requests if the path
// contains '/api/posts' and discards the other requests
// app.use is similar to app.get middleware
// app.use('/api/posts', (req, res, next) => {
app.get('/api/posts', (req, res, next) => {
  //res.send('Hello from express!');

  const posts = [
    {
      id: 'id1',
      title: 'First server-side post',
      content: 'This is coming from the server'
    },
    {
      id: 'id2',
      title: 'Second server-side post',
      content: 'This is coming from the server'
    }
  ];

  //to send response in json format
  //set the optional status and don't call next unless you want to pass
  //it to next middleware
  res.status(200).json({
    message: 'Posts fetched successfully',
    posts: posts
  });
});

module.exports = app;
