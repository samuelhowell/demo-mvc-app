const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema (
  {
    fname: {type: String, required: true},
    lname: {type: String, required: true},
    username: {type: String, required: true, lowercase: true, minlength: 3, maxlength: 20},
    email: {type: String, required: true, minlength: 5, maxlength: 20, lowercase: true},
    pass: {type: String, required: true, minlength: 8, maxlength: 30},
    role: {type: String, required: true, lowercase: true},
    salt: {type: String, required: true},

  }
);

module.exports = mongoose.model('User', UserSchema);