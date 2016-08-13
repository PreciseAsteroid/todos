var express = require('express');
var router = express.Router();

var Todo = require('../../models/todos');

router.route('/')
// get all
  .get(function(req,res,next){
    Todo.findAsync({}, null, {sort: {"_id":1}})
    .then(function(todos){
      res.json(todos);
    })
    .catch(next)
    .error(console.error);
  })
// post create a todos
  .post(function(req,res,next){
    console.log('post todo api/todos: user->  ' + req.user)
    var todo = new Todo();
    todo.user = req.user._id;
    todo.text = req.body.text;
    console.log('post todo api/todos: ' + todo);
    todo.saveAsync()
    .then(function(todo){
      console.log('success');
      res.json({'status': 'success', 'todo': todo});
    })
    .catch(function(e){
      console.log('fail');
      res.json({'status': 'fail', 'error': e });
    })
    .error(console.error)
  });

// by ID
router.route('/:id')
  .get(function(req,res,next){
    Todo.findAsync({_id:req.params.id},{text:1,done:1})
    .then(function(todo){
      res.json(todo)
    })
    .catch(next)
    .error(console.error)
  })
  // update
  .put(function(req,res,next){
    var todo = {};
    var prop;
    // building a todo frmo the req
    for (var prop in req.body) {
      todo[prop] = req.body[prop];
    }
    Todo.updateAsync({_id:req.params.id},todo)
    .then(function(updatedTodo){
      console.log(req.params.id);
      console.log(req.body);
      console.log(todo);
      console.log(updatedTodo);
      return res.json({'status':'success','todo':updatedTodo});
      return res.json({'status':'success','todo':updatedTodo});
    })
    .catch(function(e){
      return res.status(400).json({'status':'fail','error':e});
    });
  })
  .delete(function(req,res,next){
    Todo.findByIdAndRemoveAsync(req.params.id)
    .then(function(deltedTodo){
      res.json({'status':'success','todo':deltedTodo});
    })
    .catch(function(e){
      res.status(400).json({'status':'fail','error':e});
    })
  });




  module.exports = router;
