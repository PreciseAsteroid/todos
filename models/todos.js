var mongoose = require('mongoose');
var Promise = require('bluebird');

var Schema = mongoose.Schema;
Promise.promisifyAll(mongoose);

var TodosSchema = new Schema ({
  text: {type: 'String', required: true},
  done: {type: 'Boolean'}
});
var Todo = mongoose.model('Todo', TodosSchema);
module.exports = Todo;
