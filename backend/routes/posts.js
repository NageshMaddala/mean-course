//express router
const express = require("express");
const multer = require("multer");
const PostController = require("../controllers/posts");
const checkAuth = require('../middleware/check-auth');
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
//this route must be protected
router.post("",
  checkAuth,
  multer({ storage: storage }).single("image"),
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
  multer({ storage: storage }).single("image"),
  PostController.updatePost
);

router.get("/:id", PostController.getPost);

//node module syntax to export the module
//set the whole router object
module.exports = router;
