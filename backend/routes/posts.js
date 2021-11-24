//express router
const express = require("express");
const Post = require('../models/post');
const router = express.Router();

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
router.post("", (req, res, next) => {
  // const post = req.body;
  // console.log(post);

  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });

  console.log(post);
  post.save().then(result => {
    console.log("successfully added new record at the database");
    res.status(201).json({
      message: 'Post added successfully',
      postId: result._id
    });
  });

  //still need to return 201 saying everything is good
  // res.status(201).json({
  //   message: 'Post added successfully'
  // });

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
// https://mongoosejs.com/docs/guide.html#query-helpers
router.get('', (req, res, next) => {
  //res.send('Hello from express!');

  //dummy data
  // const posts = [
  //   {
  //     id: 'id1',
  //     title: 'First server-side post',
  //     content: 'This is coming from the server'
  //   },
  //   {
  //     id: 'id2',
  //     title: 'Second server-side post',
  //     content: 'This is coming from the server'
  //   }
  // ];

  Post.find()
    .then(documents => {
      console.log(documents);
      res.status(200).json({
        message: 'Posts fetched successfully',
        posts: documents
      });
    })

  //to send response in json format
  //set the optional status and don't call next unless you want to pass
  //it to next middleware
  // res.status(200).json({
  //   message: 'Posts fetched successfully',
  //   posts: posts
  // });
});

//:id dynamic path segment
// id is passed from the server
router.delete("/:id", (req, res, next) => {
  console.log(req.params.id);
  Post.deleteOne({
    _id: req.params.id
  }).then(result => {
    console.log(result);
    res.status(200).json({ message: "Post deleted" });
  })
});

router.put("/:id", (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.connect
  })
  Post.updateOne({ _id: req.params.id }, post).then(result => {
    console.log(result);
    res.status(200).json({ message: 'Update successful!' });
  });
});

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: 'Post not found!' });
    }
  });
});

//node module syntax to export the module
//set the whole router object
module.exports = router;
