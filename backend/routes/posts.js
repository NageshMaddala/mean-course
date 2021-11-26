//express router
const express = require("express");
const multer = require("multer");

const Post = require('../models/post');
const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

//configure multer on how to deal with the file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mime type');
    if (isValid) {
      error = null;
    }
    //where to store file
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
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
//multer package is used to extract the file content
router.post("", multer({ storage: storage }).single("image"), (req, res, next) => {
  // const post = req.body;
  // console.log(post);
  // protocol gives us http or https
  const url = req.protocol + '://' + req.get("host");

  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename
  });

  console.log(post);
  post.save().then(createdPost => {
    console.log("successfully added new record at the database");
    res.status(201).json({
      message: 'Post added successfully',
      //postId: result._id
      post: {
        ...createdPost,
        id: createdPost._id,
        // title: createdPost.title,
        // content: createdPost.content,
        // imagePath: createdPost.imagePath
      }
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

router.put("/:id", multer({ storage: storage }).single("image"),
  (req, res, next) => {

    //not worried about the edit logic for now..
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content
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
