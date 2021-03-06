var Q = require('q');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var SALT_WORK_FACTOR = 10; // required for salt gen
var Schema = mongoose.Schema;


var groupSchema = new Schema({
  groupname: {
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
  photo: {
    type: String,
    default: '/assets/default.png'
  },
  location: String,
  startTime: {
    type: Number,
    default: 12
  },
  endTime: {
    type: Number,
    default: 12
  }
});

groupSchema.methods.comparePasswords = function(passwordAttempt) {
  var savedPassword = this.password;
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

groupSchema.pre('save', function(next) {
  var group = this;
  if (!group.isModified('password')) {
    return next();
  }

  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) {
      return next(err);
    } else {
      bcrypt.hash(group.password, salt, null, function (err, hash) {
        if (err) {
          return next(err);
        } else {
          group.password = hash;
          group.salt = salt;
          next();
        }
      });
    }
  });
});

module.exports = mongoose.model('Group', groupSchema);
