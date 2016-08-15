var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Promise = require('bluebird');
Promise.promisifyAll(mongoose);

var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new Schema({
  username: String,
  password: String,
  isAdmin: Boolean
});

userSchema.plugin(passportLocalMongoose);

var User = mongoose.model('User', userSchema);

module.exports = User;
