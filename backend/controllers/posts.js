const Post = require('../models/post');

exports.createPost = (req, res, next) => {
  // const post = req.body;
  // console.log(post);
  // protocol gives us http or https
  const url = req.protocol + '://' + req.get("host");

  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId
  });

  // console.log(req.userData);
  //spot test from returning value from here
  // return res.status(200).json({});
  // console.log(post);
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
  })
    .catch(error => {
      res.status(500).json({
        message: "Creating a post failed"
      })
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
}

exports.updatePost = (req, res, next) => {

  //not worried about the edit logic for now..
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    creator: req.userData.userId
  })
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post).then(result => {
    //console.log(result);
    if (result.modifiedCount > 0) {
      res.status(200).json({ message: 'Update successful!' });
    } else {
      res.status(401).json({ message: 'Not Authorized!' });
    }
  })
    .catch(error => {
      res.status(500).json({
        message: "Couldn't update post!"
      });
    });
}

exports.getPosts = (req, res, next) => {
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
    .catch(error => {
      res.status(500).json({
        message: "Fetching posts failed!"
      });
    });

  //to send response in json format
  //set the optional status and don't call next unless you want to pass
  //it to next middleware
  // res.status(200).json({
  //   message: 'Posts fetched successfully',
  //   posts: posts
  // });
}

exports.getPost = (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: 'Post not found!' });
    }
  }).catch(error => {
    res.status(500).json({
      message: "Fetching post failed!"
    });
  });
}

exports.deletePost = (req, res, next) => {
  console.log(req.params.id);
  Post.deleteOne({
    _id: req.params.id,
    creator: req.userData.userId
  }).then(result => {
    console.log(result);
    if (result.deletedCount > 0) {
      res.status(200).json({ message: 'Deletion successful!' });
    } else {
      res.status(401).json({ message: 'Not Authorized!' });
    }
  })
}


