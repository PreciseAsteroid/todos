var express = require('express');
var favicon = require('serve-favicon');

var exphbs = require('express-handlebars');
var sassMiddleware = require('node-sass-middleware');
var browserify = require('browserify-middleware');
var mongoose = require('mongoose');

mongoose.connect(process.env.MONGOLAB_URI ||'mongodb://localhost/todos');
console.log('===== Connecting to DB ... =====', process.env.MONGOLAB_URI);


var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var todos = require('./routes/todos/index');
var todosAPI = require('./routes/todos/api');

var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');


// replaced with handlebars
app.engine('hbs', exphbs({extname: '.hbs', defaultLayout: 'layout'}));
app.set('view engine', 'hbs');

//sass
app.use (
   sassMiddleware({
     src: __dirname + '/saas',
     dest: __dirname + '/public',
    //  prefix: '/stylesheets',
     debug: true,
   })
 );

//  handlebars fy
browserify.settings({
   transform: ['hbsfy']
  });
// broswerify
app.get('/javascripts/bundle.js', browserify('./client/script.js'));

// browser-sync
if (app.get('env') == 'development') {
  var browserSync = require('browser-sync');
  var config = {
    files: ["public/**/*.{js,css}", "client/*.js", "sass/**/*.scss", "views/**/*.hbs"],
    logLevel: 'debug',
    logSnippet: false,
    reloadDelay: 3000,
    reloadOnRestart: true
  };
  var bs = browserSync(config);
  app.use(require('connect-browser-sync')(bs));
}
// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/todos', todos);
app.use('/api/todos', todosAPI);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
