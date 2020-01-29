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

var files = {}, 
  struct = { 
      name: null, 
      type: null, 
      size: 0, 
      data: [], 
      slice: 0, 
      currentSize: 0
};

io.on('connection', function (socket) {

  /* a new user connected */
  socket.on("create", function () {
    console.log("SOCKET a new user connected");
  });

  /* file slice received from admin */
  socket.on('slice', function (data) {

    /* if file not already uploaded */
    if (!files[data.name]) { 
      files[data.name] = Object.assign({}, struct, data); 
      files[data.name].data = []; 
      files[data.name].currentSize = 0;
    }

    /* if file has already been transfered */
    if (files[data.name] && files[data.name].currentSize == files[data.name].size && files[data.name].type == data.type) {
      socket.emit('already transfered');
      return;
    }
    
    /* save the data & increment number of slices received */
    files[data.name].data.push(data.data); 
    files[data.name].slice++;
    files[data.name].currentSize += data.currentSize;

    /* complete file is received */
    if (files[data.name].slice * 100000 >= files[data.name].size) { 
        // var fileBuffer = Buffer.concat(files[data.name].data);
        // fs.writeFile('tmp/'+data.name, fileBuffer, (err) => { 
        //     if (err) console.log('Error:', err); 
        // });
        socket.emit('upload complete', data.name);
    }
    
    /* forward slice to client */
    socket.broadcast.emit('send slice', data);

  });

  /* on disconnect */
  socket.on("disconnect", function () {
    console.log("SOCKET a user disconnected");
  });

});

module.exports = app;
