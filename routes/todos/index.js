var express = require('express');
var router = express.Router();
var Todo = require('../../models/todos');

var isLoggedIn = function(req,res,next){
  if (!req.user) {
    return res.redirect('/');
  }
  next();
}

//with promisification
router.get('/',isLoggedIn,function(req,res,next){
  console.log('showing todos of: user: ' + req.user +'. id: ' + req.user._id);
  Todo.findAsync({user:req.user._id}, null, {sort: {"_id":1}})
  .then(function(todos){
    res.render('todos', {title: 'Todos', todos: todos});
  })
  .catch(next)
  .error(console.error);

});

module.exports = router;
