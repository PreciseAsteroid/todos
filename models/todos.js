var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var TodosSchema = new Schema ({
  text: {type: 'String', required: true},
  done: {type: 'Boolean'}
});
var Todo = mongoose.model('Todo', TodosSchema);
module.exports = Todo;
