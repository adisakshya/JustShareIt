const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const qr = require('qr-image');  
const os = require('os');
const ifaces = os.networkInterfaces();

/* Users */
const USER_LIMIT = 500000;
var Users = {};

/* GET user home page. */
router.route('/')
  .get(function (req, res) {
    res.render('login', { requested: false });
  })
  .post(function (req, res) {
    res.render('login', { requested: false });
  });

/* USER REQUEST */
router.route('/request')
  .post(function (req, res) {
    /* CHECK user limit */
    if(Object.keys(Users).length >= USER_LIMIT) {
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
    if(Users[profile.username]) {
      res.json({
        "success": false,
        "error": true,
        "message": "User Already Exists! Please choose another username"
      });
    } else {
      /* CREATE new user */
      Users[profile.username] = {
        "token": null
      }
      /* Return response */
      res.json({
        "success": true,
        "error": false,
        "message": {
          "username": profile.username
        }
      });
    }
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
    if(Users[profile.username] && Users[profile.username].token) {
      res.send("User Already Approved!");
    } else if(Users[profile.username] && !Users[profile.username].token) {
      /* sending the profile in the token */
      var jwtToken = jwt.sign(profile, 'SECRET_KEY');
      /* ADD user token */
      Users[profile.username].token = jwtToken;
      res.send("User Approved");
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
    if(Users[profile.username]) {
      delete Users[profile.username];
      res.send("User Rejected");
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
    if(Users[profile.username] && Users[profile.username].token) {
      /* SEND request token */
      res.json({
        "success": true,
        "error": false,
        "message": {
          "token": Users[profile.username].token,
          "verified": true,
          "username": profile.username
        },
      });
      return;
    } else if(Users[profile.username] && !Users[profile.username].token) {
      res.json({
        "success": true,
        "error": false,
        "message": {
          "verified": false
        }
      });
      return;
    }

    /* Username not found */
    res.json({
      "success": false,
      "error": true,
      "message": "Username not found!"
    });
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
    if(Users[username] && Users[username].token && Users[username].token === token) {
      res.render('client');
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
