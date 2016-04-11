var Q = require('q');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var SALT_WORK_FACTOR = 10; // required for salt gen
var Schema = mongoose.Schema;

var userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  salt: String,

  name: String,
  email: String,
  summary: String,
  photo: String, // store path to file location

  // user availability
  startTime: Number,
  endTime: Number
});

userSchema.methods.comparePasswords = function(passwordAttempt) {
  var savedPassword = this.password;
  // should return a promise that compares passwords
  return Q.promise(function(resolve, reject) {
    bcrypt.compare(passwordAttempt, savedPassword, function(err, isMatch) {
      if (err) {
        reject(err);
      } else {
        resolve(isMatch);
      }
    });
  });
};

userSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) {
    return next(); // perform next middleware action on the controller
  }

  bycrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    user.salt = salt;
    next();
  });
});

module.exports = mongoose.model('User', userSchema);
