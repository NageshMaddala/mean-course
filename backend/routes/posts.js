//express router
const express = require("express");
const PostController = require("../controllers/posts");
const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');
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
//multer package is used to extract the file content
//this route must be protected
router.post("",
  checkAuth,
  extractFile,
  PostController.createPost);

// basically it honors only the requests if the path
// contains '/api/posts' and discards the other requests
// app.use is similar to app.get middleware
// app.use('/api/posts', (req, res, next) => {
// https://mongoosejs.com/docs/guide.html#query-helpers
router.get('', PostController.getPosts);

//:id dynamic path segment
// id is passed from the server
// this route must be protected
router.delete("/:id", checkAuth, PostController.deletePost);

//this route must be protected
router.put("/:id",
  checkAuth,
  extractFile,
  PostController.updatePost
);

router.get("/:id", PostController.getPost);

//node module syntax to export the module
//set the whole router object
module.exports = router;
