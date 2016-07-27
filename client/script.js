var $ = require('jquery');
var todoTemplate = require('../views/partials/todo.hbs');

$(function(){
  $(":button").on('click', addTodo);
  $(":text").on('keypress', function(e){
    var key = e.keyCode;
    if (key == 13 || key == 169) {
      addTodo();
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  });

  // event handles
  // setting the checkbox
  $('ul').on('change', 'li :checkbox', function(e) {
    var $this = $(this),
        $input = $this[0],
        $li = $this.parent(),
        id = $li.attr('id'),
        checked = $input.checked,
        data = {done : checked};
    updateTodo(id,data, function(){
      $this.next().toggleClass('checked');
    });

  });

// hitting enter after changing the text
$('ul').on('keydown', 'li span', function(e) {
  var $this = $(this),
      $span = $this[0],
      $li = $this.parent(),
      id = $li.attr('id'),
      key = e.keyCode,
      target = e.target,
      text = $span.innerHTML,
      data = {text:text};
    $this.addClass('editing');
    if (key === 27 ) { //escape key
      // TODO: hitting escape does not bring you back to the previous state
      $this.removeClass('editing');
      document.execCommand('undo');
      target.blur(); // lose focuse
    } else if (key === 13 ){ // enter key
      updateTodo(id,data,function(d){
        $this.removeClass('editing');
        target.blur();
      });
      e.preventDefault();
    }
});

// deleting a todo handler
$('ul').on('click', 'li a', function(e) {
  var $this = $(this),
      $input = $this[0],
      $li = $this.parent(),
      $id = $li.attr('id');
  console.log($id);
  deleteTodo($id,function(e){
    deleteTodoli($li);
  });
});

// initializing the DOM observer
initTodoObserver();

});

var addTodo = function(){
  console.log('addTodo() was called');
  var text = $('#add-todo-text').val();
  $.ajax({
    url: '/api/todos/',
    type: 'POST',
    data: {
      text:text
    },
    dataType: 'json',
    success: function(data){
      var todo = data.todo[0];
      var newLiHtml = todoTemplate(todo);
      $('form + ul').append(newLiHtml);
      $('#add-todo-text').val('');
    }
  });
};

var updateTodo = function(id, data, cb){
  $.ajax({
    url:  'api/todos/'+id,
    type: 'PUT',
    data: data,
    dataType: 'json',
    success: function(){
        cb();
    }
  });
};

var deleteTodo = function(id,cb){
  $.ajax({
    url: 'api/todos/' +id,
    type: 'DELETE',
    dataType: 'json',
    data: {
      id: id
    },
    success: function(){
      cb();
    }
  });
};

var deleteTodoli = function($li){
  $li.remove();
  console.log('I am now removing the line');
};

//Ajax UI helpers

var initTodoObserver = function(){
  var target = $('ul')[0];
  var config = { attributes: true, childList: true, characterData: true};
  var observer = new MutationObserver(function(mutationRecords){
    $.each(mutationRecords, function(index, mutationRecord) {
      updateTodoCount();
    });
  });
  observer.observe(target, config);
  updateTodoCount();
};

var updateTodoCount = function(){
  $(".count").text($('li').length);
};

// filters
// show all
$('.filter').on('click', '.show-all', function(e) {
  $('.hide').removeClass('hide');
});

// show not done
$('.filter').on('click', '.show-not-done', function(e) {
  $('.hide').removeClass('hide');
  $('.checked').closest('li').addClass('hide');
});

// show done
$('.filter').on('click', '.show-done', function(e) {
  $('li').addClass('hide');
  $('.checked').closest('li').removeClass('hide');
});

// clear all todos => delete every todo which is done
$('.clear').on('click', function(e) {
    var $doneLi = $('.checked').closest('li');
    for (var i = 0; i < $doneLi.length; i++) {
      var $li = $($doneLi[i]); // still need just to get the line and not the all structure
      var id = $li.attr('id');
      (function($li){ // wrapping deleteTodo in a closure so that $li will continue to live there when the call back is launched
        deleteTodo(id,function(){
          deleteTodoli($li);
        });
      })($li);
    }

  });
