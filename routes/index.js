var express = require('express');
var router = express.Router();
var passport = require('passport');
var user = require('../models/users');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'my Todos WebApp implemented in Express & MongoDB', user: req.user });
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
        // TODO: show error in register screen
      }
      passport.authenticate('local')(req,res,function(){
        // TODO: should I save the session req.session.save? taken from gutams github
        res.redirect('/');
      });

  });
});

//login / get

router.get('/login',function(req, res){
  res.render('login',{});
});

// login / post

router.post('/login',passport.authenticate('local'),function(req,res){
  res.redirect('/');
});

module.exports = router;
