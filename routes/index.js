var express = require('express');
var router = express.Router();
var passport = require('passport');
var user = require('../models/users');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'My Todos Express', user: req.user });
});

router.get('/register',function(req, res){
  res.render('register',{});
});

module.exports = router;
