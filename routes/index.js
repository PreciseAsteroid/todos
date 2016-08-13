var express = require('express');
var router = express.Router();
var passport = require('passport');
var user = require('../models/users');

/* GET home page. */
router.get('/', function(req, res) {
  console.log('log user from get home: ' + req.user);
  console.log('log session from get home: ' + req.session);
  // console.log(req);
  res.render('index', { title: 'Todos', user: req.user });
});


// Regiser / get
router.get('/register',function(req, res){
  res.render('register',{});
});

// Register /post

router.post('/register',function(req,res){
  user.register(new user({ username: req.body.username}),req.body.password, function(err,user){
      if (err) {
        return res.render('regiser',{error: err.message, user: user});
      }
      passport.authenticate('local')(req,res,function(){
        res.redirect('/');
      });

  });
});

//login / get

router.get('/login',function(req, res){
  res.render('login',{user:req.user});
});

// login / post

router.post('/login',passport.authenticate('local'),function(req,res){
  console.log('logged from post login: ' + req.user);
  res.redirect('/');
});

//logout
router.get('/logout',function(req,res){
  req.logout();
  res.redirect('/');
});

module.exports = router;
