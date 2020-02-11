const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fs = require('fs');
const socket = require('socket.io');

const usersRouter = require('./routes/users');

const app = express();

/* view engine setup */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', usersRouter);

/* catch 404 and forward to error handler */
app.use(function(req, res, next) {
  next(createError(404));
});

/* error handler */
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

/* Sockets Setup */
const io = socket();
app.io = io;

/* Define file structure */
var files = {};

/* On Connection */
io.on('connection', function (socket) {

  /* a new user connected */
  socket.on("create", function () {
    console.log("[SOCKET] => a new user connected");
  });

  /* file slice received from admin */
  socket.on('slice', function (data) {

    /* File hasn't been shared yet */
    if(!files[data.name]) {
      files[data.name] = data.size;
    }

    /* File has completely been transfered */
    if(data.size < data.offset) {
      return;
    }

    /* Forward slice to client */
    socket.broadcast.emit('send slice', data);

    /* Request next slice */
    socket.emit('request slice', data.name, data.offset);

  });

  /* Admin request list of files shared */
  socket.on('get files', function () {
    /* Emit shared files information */
    socket.emit('shared files', files);
  });

  /* on disconnect */
  socket.on("disconnect", function () {
    console.log("[SOCKET] => a user disconnected");
  });

});

module.exports = app;
