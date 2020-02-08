var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var qr = require('qr-image');  
var os = require('os');
var ifaces = os.networkInterfaces();

/* Users */
const USER_LIMIT = 100000;
var Users = [];

/* GET user home page. */
router.route('/')
  .get(function (req, res) {
    res.render('login', { requested: false });
  });

/* USER REQUEST */
router.route('/request')
  .post(function (req, res) {
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

    /* Check if username provided */
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
    
    /* Return response */
    res.json({
      "success": true,
      "error": false,
      "message": {
        "username": newUser.username
      }
    });
  });

/* GET LIST OF USERS */
router.route('/users')
  .post(function (req, res) {
    /* Return Response */
    res.json({
      "success": true,
      "error": false,
      "message": {
        "users": Users
      }
    });
  });

/* APPROVE REQUEST FOR A USER */
router.route('/approve')
  .post(function (req, res) {
    /* GET username */
    var profile = {
      username: req.body.username,
    };

    /* Check if username provided */
    if(!profile.username) {
      res.json({
        "success": false,
        "error": true,
        "message": "Please provide a username!"
      });
      return;
    }

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
router.route('/reject')
  .post(function (req, res) {
    /* GET username */
    var profile = {
      username: req.body.username
    };

    /* Check if username provided */
    if(!profile.username) {
      res.json({
        "success": false,
        "error": true,
        "message": "Please provide a username!"
      });
      return;
    }

    /* CHECK if username exist */
    if(!Users.length) {
      res.send("Invalid Request!");
    }
    for(var i=0; i<Users.length; i++) {
      if(Users[i].username === profile.username) {
        Users = Users.slice(0, i);
        console.log(Users);
        res.send("User Rejected");
      }
    }
  });

/* VERIFY ACCESS FOR A USER */
router.route('/verify')
  .post(function (req,res) {
    /* GET username */
    var profile = {
      username: req.body.username,
    };

    /* Check if username provided */
    if(!profile.username) {
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
  });

/* Client Index Page */
router.route('/client')
  .post(async function (req, res) {
    /* Get token */
    var username = req.body.username;
    var token = req.body.token;
    
    /* Check if username provided */
    if(!username) {
      res.json({
        "success": false,
        "error": true,
        "message": "Please provide a username!"
      });
      return;
    }
    
    /* Check if token supplied */
    if(!token) {
      res.send("Token Not Found");
    }

    /* If user is verified then render client page */
    for(var i=0; i<Users.length; i++) {
      if(Users[i].username === username && Users[i].token && Users[i].token === token) {
        res.render('client');
      }
    }

    /* User not verified */
    res.redirect('/');
  });

/* ADMIN */
router.route('/admin')
  .get(function(req, res, next) {
    res.render('admin', { users: Users });
  });

/* QR Code */
router.route('/qr')
  .get(function(req, res) {
    Object.keys(ifaces).forEach(function (ifname) {
      if(ifname === 'Wi-Fi') {
        ifaces[ifname].forEach(function (iface) {
          if ('IPv4' !== iface.family || iface.internal !== false) {
            return;
          }
          var code = qr.image(new URL('http://'+iface.address+':3000').toString(), { type: 'svg' });
          res.type('svg');
          code.pipe(res);
        });
        return;
      }
    });
  });

module.exports = router;
