var mongoose = require('mongoose');
var async = require('async');
var Todo = require('../models/todos');
var User = require('../models/users');
var Promise = require('bluebird');

Promise.promisifyAll(mongoose);


var dbConnectionString = process.env.MONGODB_URI || 'mongodb://localhost';
console.log('dbConnectionString is:' + dbConnectionString);

// pick the user to update orphan todos with based on environment
var username;
// ,user_id;
if (process.env.MONGODB_URI) {
    username = 'Amir';
} else { // running in local host
    username = 'amir'
}


mongoose.connect(dbConnectionString + '/todos');
console.log(mongoose.connection.db.databaseName);


User.findOne({'username' : username})
.then(function(user){
    console.log(user);
    // user_id = user._id;
    console.log(user._id);
    return user._id;

})
.then(function(user_id){
    Todo.update({ "user" : { "$exists" : false }},{user : user_id},{multi: true},function(err,raw){
        if (err) return handleError(err);
        console.log('The raw response from Mongo was ', raw);
        mongoose.disconnect();
    })
})
.catch(function(err){
    console.log(err);
    mongoose.disconnect();
})
