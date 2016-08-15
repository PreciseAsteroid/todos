var express = require('express');
var router = express.Router();
var User = require('../models/users');


/* GET users listing. */
router.get('/', function(req, res, next) {
  User.findAsync({},null,{sort: {"_id":1}})
  .then(function(users){
    // res.json(users);
    res.render('users',{users:users})
  })
  .catch(next)
  .error(console.error);
});

module.exports = router;
