const mongoose = require('mongoose');

// uniqueValidator is an extra hook, it basically checks the data before
// saving the record to the database
const uniqueValidator = require("mongoose-unique-validator");

//create blueprint for data
//string with caps S is the type for mongoose
//read more about schemas in mongoose on their website
//Note: unique value in database is not validated by schema, we need to do it on our own
//mongoose has a validtor which does this for us, it adds validaton logic for us
// npm install --save mongoose-unique-validator
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

//create models based on the above schema
//this model is the bridge between express and mangodb
module.exports = mongoose.model('User', userSchema);
