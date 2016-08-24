var $ = require('jquery');
var todoTemplate = require('../views/partials/todo.hbs');
var KEY_ENTER = 13;
var KEY_ESCAPE = 27;

$(function(){
  var app = (function() {
    console.log('in app');
    // hold references to the tags
    var $todoTextField = $('#add-todo-text'),
        $todoButton = $('#add-todo-text-btn'),
        $todoList = $('ul.todos_list'),
        $filter = $('.filter'),
        $clear = $('.clear'),
        $count = $('.count');

    var init = function() {
      console.log('in init');
      registerEvents();
    };

    var registerEvents = function() {
      $todoButton.on('click', addTodo);
      $todoTextField.on('keypress', addTodoIfKeyPressEnter);
      $todoList.on('change', 'li input:checkbox',updateTodoStatus );
      $todoList.on('keydown', 'li span',updateTodoText );
      $todoList.on('click', 'li a', deleteTodo);
      $filter.on('click', '.show-all', showAll);
      $filter.on('click', '.show-not-done', showNotDone);
      $filter.on('click', '.show-done', showDone);
      $clear.on('click', deleteTodosDone);

    };

    // Add todos
    var addTodo = function() {
      $todoTextField.attr('disabled',true);
      var text = getTodoText();
      addTodoAjax({text: text});
      $todoTextField.attr('disabled',false);

    };

    var getTodoText = function(){
      return $todoTextField.val();
    };

    var addTodoAjax = function(data){
      $.ajax({
        url: '/api/todos',
        type: 'POST',
        data: data,
        dataType: 'json',
        success: function(data){
          var todo = data.todo;
          appendTodoLi(todo);
          clearTodoText();
          updateTodoCount();
        }

        }
      );
    };

    var appendTodoLi = function(todo){
      var TodoHTML = todoTemplate(todo);
      $todoList.append(TodoHTML);
    };

    var clearTodoText = function() {
      $todoTextField.val('');
    };

    var updateTodoCount = function() {
      $count.text($todoList.children().length);
    };

    var addTodoIfKeyPressEnter = function() {
      var key = event.keyCode;
      if (key === KEY_ENTER) {
        addTodo();
        event.preventDefault();
      }
    };

    // Update todos

    // // update status
    var updateTodoStatus = function() {
      var todo = getTodoData(this);
      updateTodoAjax(todo.id, {done: todo.checked},function(data) {
        updateTodoLiAsChecked(this);
      }.bind(this));
    };

    var getTodoData = function(_this) {
      var $li = getTodoLi(_this),
           id = $li.attr('id'),
           text = $li.children('span').text(),
           checked = $li.children('input').is(':checked');
      return {
        id : id,
        text: text,
        checked: checked
      };
    };

    var getTodoLi = function(_this) {
      return $(_this).parent('li');
    };

    var updateTodoAjax = function(id, data, cb) {
      $.ajax({
        url: 'api/todos/' + id,
        type: 'PUT',
        data: data,
        dataType: 'json',
        success: function(data) {
          cb(data);
        }

      });
    };

    var updateTodoLiAsChecked = function(_this) {
      getTodoLi(_this).toggleClass('checked');
    };

    var updateTodoText = function(event) {
      var todo = getTodoData(this),
          $this = $(this),
          key = event.keyCode,
          target = event.target;
          $this.addClass('editing');
          if (key === KEY_ESCAPE) {
            this.removeClass('editing');
            document.execCommand('undo');
          } else if (key === KEY_ENTER) {
            updateTodoAjax(todo.id,{text: todo.text},function(data) {
              $this.removeClass('editing');
              target.blur();
            });
            event.preventDefault();
          }
    };

    // Delete todos

    var deleteTodo = function() {
      var todo = getTodoData(this);
      deleteTodoAjax(todo.id,function(data) {
        deleteTodoLi(this);
        // updateTodoCount();
      }.bind(this));
    };

    var deleteTodoAjax = function(id, cb) {
      $.ajax({
        url: '/api/todos/' +id,
        type: 'DELETE',
        dataType: 'json',
        success: function(data){
          cb(data);
        },
        error: function(e) {
          console.log(e);
        },
        complete: function(str,status) {
          console.log(str);
          console.log(status);
        }

      });
    };

    var deleteTodoLi = function(_this) {
      getTodoLi(_this).remove();
    };

    // Footer

    // // count

    // // filter

    var getTodoLiList = function() {
      return $('li');
    };

    var getTodoLiCheckedList = function() {
      return $('li.checked');
    };

    var showAll = function() {
      getTodoLiList().removeClass('hide');
    };

    var showNone = function() {
      getTodoLiList().addClass('hide');
    };

    var showNotDone = function() {
      showAll();
      getTodoLiCheckedList().addClass('hide');
    };

    var showDone = function() {
      showNone();
      getTodoLiCheckedList().removeClass('hide');
    };

    // // Clear
    var deleteTodosDone = function() {
      console.log('delete todos done is called');
      var $done = getTodoLiCheckedList().find('span');
      console.log($done);
      var todo;
      for (var i = 0; i < $done.length; i++) {
        console.log('I am lopping #: ' + (i+1));
        todo = getTodoData($done[i]);
        (function($done) {
          console.log(todo);
          deleteTodoAjax(todo.id,function() {
            deleteTodoLi($done);
            updateTodoCount();
          });
        })($done[i]);
      }
    };
    // var deleteTodosDone = function() {
    //   var $done = getTodoLiCheckedList().find('span');
    //   var todo;
    //   for (var i = 0; i < $done.length; i++) {
    //     todo = getTodoData($done[i]);
    //     (function($done[i]){
    //         deleteTodoAjax(todo.id,function() {
    //           deleteTodoLi($done);
    //           updateTodoCount();
    //         });
    //     })($done[i]);
    //   }
    // };

// TODO: check what is that form of retruning a function does
    return {
      init: init
    };

  })();
  app.init();
});

//
// $(function(){
//   $(":button").on('click', addTodo);
//   $(":text").on('keypress', function(e){
//     var key = e.keyCode;
//     if (key == 13 || key == 169) {
//       $(this).attr('disabled',true);
//       addTodo();
//       e.preventDefault();
//       e.stopPropagation();
//       return false;
//     }
//   });
//
//   // event handles
//   // setting the checkbox
//   $('ul').on('change', 'li :checkbox', function(e) {
//     var $this = $(this),
//         $input = $this[0],
//         $li = $this.parent(),
//         id = $li.attr('id'),
//         checked = $input.checked,
//         data = {done : checked};
//     updateTodo(id,data, function(){
//       $this.next().toggleClass('checked');
//     });
//
//   });
//
// // hitting enter after changing the text
// $('ul').on('keydown', 'li span', function(e) {
//   var $this = $(this),
//       $span = $this[0],
//       $li = $this.parent(),
//       id = $li.attr('id'),
//       key = e.keyCode,
//       target = e.target,
//       text = $span.innerHTML,
//       data = {text:text};
//     $this.addClass('editing');
//     if (key === 27 ) { //escape key
//       // TODO: hitting escape does not bring you back to the previous state
//       $this.removeClass('editing');
//       document.execCommand('undo');
//       target.blur(); // lose focuse
//     } else if (key === 13 ){ // enter key
//       updateTodo(id,data,function(d){
//         $this.removeClass('editing');
//         target.blur();
//       });
//       e.preventDefault();
//     }
// });
//
// // deleting a todo handler
// $('ul').on('click', 'li a', function(e) {
//   var $this = $(this),
//       $input = $this[0],
//       $li = $this.parent(),
//       $id = $li.attr('id');
//
//   console.log($id);
//   deleteTodo($id,function(e){
//     deleteTodoli($li);
//   });
// });
//
// // initializing the DOM observer
// initTodoObserver();
//
// });
//
// var addTodo = function(){
//   console.log('addTodo() was called');
//   var text = $('#add-todo-text').val();
//
//   $.ajax({
//     url: '/api/todos/',
//     type: 'POST',
//     data: {
//       text:text
//     },
//     dataType: 'json',
//     success: function(data){
//       var todo = data.todo;
//       var newLiHtml = todoTemplate(todo);
//       $('form + ul').append(newLiHtml);
//       $('#add-todo-text').val('')
//                          .attr('disabled',false);
//
//     }
//   });
// };
//
// var updateTodo = function(id, data, cb){
//   $.ajax({
//     url:  'api/todos/'+id,
//     type: 'PUT',
//     data: data,
//     dataType: 'json',
//     success: function(){
//         cb();
//     }
//   });
// };
//
// var deleteTodo = function(id,cb){
//   $.ajax({
//     url: 'api/todos/' +id,
//     type: 'DELETE',
//     dataType: 'json',
//     data: {
//       id: id
//     },
//     success: function(){
//       cb();
//     }
//   });
// };
//
// var deleteTodoli = function($li){
//   $li.remove();
//   console.log('I am now removing the line from the DOM');
// };
//
// //Ajax UI helpers
//
// var initTodoObserver = function(){
//   var target = $('ul.todos_list')[0];
//   var config = { attributes: true, childList: true, characterData: true};
//   var observer = new MutationObserver(function(mutationRecords){
//     $.each(mutationRecords, function(index, mutationRecord) {
//       updateTodoCount();
//     });
//   });
//   observer.observe(target, config);
//   updateTodoCount();
// };
//
// var updateTodoCount = function(){
//   $(".count").text($('.todos_list li').length);
// };
//
// // filters
// // show all
// $('.filter').on('click', '.show-all', function(e) {
//   $('.hide').removeClass('hide');
// });
//
// // show not done
// $('.filter').on('click', '.show-not-done', function(e) {
//   $('.hide').removeClass('hide');
//   $('.checked').closest('li').addClass('hide');
// });
//
// // show done
// $('.filter').on('click', '.show-done', function(e) {
//   $('li').addClass('hide');
//   $('.checked').closest('li').removeClass('hide');
// });
//
// // clear all todos => delete every todo which is done
// $('.clear').on('click', function(e) {
//     var $doneLi = $('.checked').closest('li');
//
//
//     for (let i = 0; i < $doneLi.length; i++) {
//       let $li = $($doneLi[i]);
//       let id =  $li.attr('id');
//       deleteTodo(id,function(){
//         deleteTodoli($li);
//       });
//     }
//
//   });
