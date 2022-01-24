const mongoose = require('mongoose');

//create blueprint for data
//string with caps S is the type for mongoose
//read more about schemas in mongoose on their website
const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imagePath: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

//create models based on the above schema
//this model is the bridge between express and mangodb
module.exports = mongoose.model('Post', postSchema);
