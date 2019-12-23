var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('fs');
var socket = require('socket.io');

var indexRouter = require('./routes/admin');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', indexRouter);
app.use('/', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Sockets Setup
var io = socket();
app.io = io;

io.on('connection', function (socket) {

  socket.on("create", function () {
    console.log("SOCKET a new user connected");
  });
  
  var data = '';
  
  var readerStream = fs.createReadStream('image.jpeg');  
  readerStream.setEncoding('binary'); 

  readerStream.on('data', function(chunk) {
    data += chunk;
    socket.emit('image', chunk);
  }); 
    
  readerStream.on('end',function() { 
      console.log("READSTREAM end event triggered"); 
  }); 
    
  readerStream.on('error', function(err) { 
      console.log('READSTREAM Error: ', err.stack); 
  }); 
 
  socket.on("disconnect", function () {
    console.log("SOCKET a user disconnected");
  });

});

module.exports = app;
