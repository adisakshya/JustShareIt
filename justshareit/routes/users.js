var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var adminAuth = require('../utils/adminAuth');

/* Users */
const USER_LIMIT = 100000;
var Users = [];

/* GET user home page. */
router.get('/', function (req, res) {
  res.render('login', { requested: false });
});

/* USER REQUEST */
router.post('/request', function (req, res) {

  /* CHECK user limit */
  if(Users.length >= USER_LIMIT) {
    res.json({
      "success": false,
      "error": true,
      "message": "Admin is currently to busy to handle this request! Please try again after sometime."
    });
  }

  /* GET username */
  var profile = {
    username: req.body.username,
  };

  if(!profile.username) {
    res.json({
      "success": false,
      "error": true,
      "message": "Please provide a username!"
    });
    return;
  }

  /* Check for duplicate username */
  for(var i=0; i<Users.length; i++) {
    if(Users[i].username === req.body.username) {
      res.json({
        "success": false,
        "error": true,
        "message": "User Already Exists! Please choose another username"
      });
      return;
    }
  }
  
  /* CREATE new user */
  var newUser = { username: req.body.username };
  Users.push(newUser);
  
  res.json({
    "success": true,
    "error": false,
    "message": {
      "username": newUser.username
    }
  });

});

/* GET LIST OF USERS */
router.post('/users', function (req, res) {

  /* GET all users */
  res.json({
    "success": true,
    "error": false,
    "message": {
      "users":Users
    }
  });

});

/* APPROVE REQUEST FOR A USER */
router.post('/approve', function (req, res) {

  /* AUTHENTICATE ADMIN */
  // var adminIdentity = adminAuth();
  // var requestIdentity = req.connection.remoteAddress;
  
  // var flag = 0;
  // for(var i=0; i<adminIdentity.length; i++) {
  //   if(adminIdentity[i] === requestIdentity.split(":")[3]) {
  //     flag = 1;
  //   }
  // }
  
  // if(!flag) {
  //   res.send("Only Admin can do this!");
  // }

  /* GET username */
  var profile = {
    username: req.body.username,
  };

  /* CHECK if username exist */
  if(!Users.length) {
    res.send("Invalid Request!");
  }
  for(var i=0; i<Users.length; i++) {
    if(Users[i].username === req.body.username && !Users[i].token) {
      /* sending the profile in the token */
      var jwtToken = jwt.sign(profile, 'SECRET_KEY');
      /* ADD user token */
      Users[i].token = jwtToken;
      res.send("User Approved");
    } else if(Users[i].username === req.body.username && Users[i].token) {
      res.send("User Already Approved!");
    }
  }

});

/* REJECT REQUEST FOR A USER */
router.post('/reject', function (req, res) {

  /* AUTHENTICATE ADMIN */
  // var adminIdentity = adminAuth();
  // var requestIdentity = req.connection.remoteAddress;
  
  // var flag = 0;
  // for(var i=0; i<adminIdentity.length; i++) {
  //   if(adminIdentity[i] === requestIdentity.split(":")[3]) {
  //     flag = 1;
  //   }
  // }
  
  // if(!flag) {
  //   res.send("Only Admin can do this!");
  // }

  /* GET username */
  var profile = {
    username: req.body.username
  };

  /* CHECK if username exist */
  if(!Users.length) {
    res.send("Invalid Request!");
  }

  for(var i=0; i<Users.length; i++) {
    if(Users[i].username === profile.username) {
      Users = Users.slice(0, i);
      console.log(Users);
      res.send("User Rejected");
    } else {
      res.send("Error!");
    }
  }

});

/* VERIFY ACCESS FOR A USER */
router.post('/verify', function (req,res) {

  try {

  /* GET username */
  var profile = {
    username: req.body.username,
  };

  if(!(profile.username)) {
    res.json({
      "success": false,
      "error": true,
      "message": "Please provide a username!"
    });
    return;
  }

  /* CHECK if username exist or is already verified */
  if(!Users.length) {
    res.json({
      "success": false,
      "error": true,
      "message": {
        "verified": false
      }
    });
  }
  
  for(var i=0; i<Users.length; i++) {
    if(Users[i].username === profile.username && Users[i].token) {
      /* SEND request token */
      res.json({
        "success": true,
        "error": false,
        "message": {
          "token": Users[i].token,
          "verified": true,
          "username": profile.username
        },
      });
    } else if(Users[i].username === profile.username && !Users[i].token){
      res.json({
        "success": true,
        "error": false,
        "message": {
          "verified": false
        }
      });
    }
  }

  /* Username not found */
  res.redirect('/');

} catch (err) {
  res.send(err);
}

});

/* Client Index Page */
router.post('/client', async function (req, res) {

  /* Get token */
  var username = req.body.username;
  var token = req.body.token;
  
  /* Check if token supplied */
  if(!token) {
    res.send("Token Not Found");
  }

  for(var i=0; i<Users.length; i++) {
    if(Users[i].username === username && Users[i].token && Users[i].token === token) {
      res.render('client');
    }
  }

  res.redirect('/');
});

/* ADMIN */
router.get('/admin', function(req, res, next) {
  res.render('admin', { users: Users });
});

module.exports = router;
