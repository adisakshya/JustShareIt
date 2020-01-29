var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var adminAuth = require('../utils/adminAuth');

/* Users */
const USER_LIMIT = 100000;
var Users = [];

/* GET user home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

/* USER REQUEST */
router.post('/request', function (req, res) {

  /* CHECK user limit */
  if(Users.length >= USER_LIMIT) {
    res.send("Admin is currently to busy to handle this request!");
  }

  /* GET username */
  var profile = {
    username: req.body.username,
  };

  if(!profile.username) {
    res.send("Invalid Request!");
    return;
  }

  /* Check for duplicate username */
  for(var i=0; i<Users.length; i++) {
    if(Users[i].username === req.body.username) {
      res.send("User Already Exists! Please choose another username");
      return;
    }
  }
  
  /* CREATE new user */
  var newUser = { username: req.body.username };
  Users.push(newUser);
  
  res.send("Request Made!");

});

/* GET LIST OF USERS */
router.post('/users', function (req, res) {

  /* GET all users */
  res.json({"users":Users});

});

/* APPROVE REQUEST FOR A USER */
router.post('/approve', function (req, res) {

  /* AUTHENTICATE ADMIN */
  var adminIdentity = adminAuth();
  var requestIdentity = req.connection.remoteAddress;
  
  var flag = 0;
  for(var i=0; i<adminIdentity.length; i++) {
    if(adminIdentity[i] === requestIdentity.split(":")[3]) {
      flag = 1;
    }
  }
  
  if(!flag) {
    res.send("Only Admin can do this!");
  }

  /* GET username */
  var profile = {
    username: req.body.username,
  };

  /* CHECK if username exist */
  var userIndex = 0;
  for(var i=0; i<Users.length; i++) {
    if(!(Users[i].username === req.body.username)) {
      res.send("Invalid Request!");
    } else if(Users[i].token) {
      res.send("User Already Approved!");
    } else {
      userIndex = i;
    }
  }

  /* sending the profile in the token */
  var jwtToken = jwt.sign(profile, 'SECRET_KEY');

  /* ADD user token */
  Users[userIndex].token = jwtToken;

  res.send("User Approved");

});

/* VERIFY ACCESS FOR A USER */
router.post('/verify', function (req,res) {

  /* GET username */
  var profile = {
    username: req.body.username,
  };

  /* CHECK if username exist or is already verified */
  var userIndex = 0;
  for(var i=0; i<Users.length; i++) {
    if(!(Users[i].username === req.body.username)) {
      res.send("Invalid Request!");
    } else {
      userIndex = i;
    }
  }

  /* GET request token */
  var jwtToken = Users[userIndex].token;

  /* SEND request token */
  res.json({'token': jwtToken});

});

module.exports = router;
