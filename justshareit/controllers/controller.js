const jwt = require('jsonwebtoken');
const qr = require('qr-image');  
const os = require('os');
const ifaces = os.networkInterfaces();

/* Temporary User Store */
const USER_LIMIT = 500000;
const { Users } = require('../utils/users');
var users = new Users();

/**
 * 
 * @param {object} req
 * @param {object} res
 */
const loginIndex = (req, res) => {
    res.render('login', { requested: false });
};

/**
 * 
 * @param {object} req : contain username
 * @param {object} res
 *  
 */
const userRequests = (req, res) => {
    /* Check maximum user limit */
    if(users.getTotalUsers() >= USER_LIMIT) {
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
    if(users.getUser(profile.username)) {
      res.json({
        "success": false,
        "error": true,
        "message": "User Already Exists! Please choose another username"
      });
    } else {
      /* CREATE new user */
      users.addUser(profile.username);
      
      /* Return response */
      res.json({
        "success": true,
        "error": false,
        "message": {
          "username": profile.username
        }
      });
    }
};

/**
 * 
 * @param {object} req 
 * @param {object} res 
 */
const usersList = (req, res) => {
    /* Return Response */
    res.json({
        "success": true,
        "error": false,
        "message": {
          "users": users.getUserList()
        }
      });
};

/**
 * 
 * @param {object} req : contain username
 * @param {object} res 
 */
const approveUser = (req, res) => {
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
      if(users.getRequestStatus(profile.username)) {
        res.json({
          "success": true,
          "error": false,
          "message": "User already approved."
        });
        return;
      } else if(users.getRequestStatus(profile.username) === -1) {
        res.json({
          "success": false,
          "error": true,
          "message": "Username doesn't exist!"
        });
        return;
      } else {
        /* sending the profile in the token */
        var jwtToken = jwt.sign(profile, 'JUSTSHAREIT_ADMIN_SECRET_KEY');
        /* ADD user token */
        users.updateRequest(profile.username, jwtToken)
        res.send("User Approved.");
      }
};

/**
 * 
 * @param {object} req : contain username
 * @param {object} res 
 */
const rejectUser = (req, res) => {
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
    if(users.getUser(profile.username)) {
      users.removeUser(profile.username);
      res.send("User Rejected.");
    }
};

/**
 * 
 * @param {object} req : contain username
 * @param {object} res 
 */
const verifyUser = (req, res) => {
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
    if(!users.getUser(profile.username)) {
      /* Username not found */
      res.json({
        "success": false,
        "error": true,
        "message": "Username not found!"
      });
    } 
    
    if(users.getRequestStatus(profile.username)) {
      /* SEND request token */
      res.json({
        "success": true,
        "error": false,
        "message": {
          "token": users.getUser(profile.username).token,
          "verified": true,
          "username": profile.username
        },
      });
      return;
    } else {
      res.json({
        "success": true,
        "error": false,
        "message": {
          "verified": false
        }
      });
      return;
    }
};

/**
 * 
 * @param {object} req : contain username, token
 * @param {object} res 
 */
const clientIndex = (req, res) => {
    /* Get Username */
    var username = req.body.username;
    
    /* Check if username provided */
    if(!username) {
      res.json({
        "success": false,
        "error": true,
        "message": "Please provide a username!"
      });
      return;
    }

    /* If user is verified then render client page */
    if(users.getRequestStatus(username)) {
      res.render('client');
    } else {
      /* User not verified */
      res.redirect('/');
    }
};

/**
 * 
 * @param {object} req
 * @param {object} res 
 */
const adminIndex = (req, res) => {
    res.render('admin', { "users": users.getUserList() });
};

/**
 * 
 * @param {object} req
 * @param {object} res 
 */
const qrCode = (req, res) => {
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
};

exports.loginIndex = loginIndex;
exports.userRequests = userRequests;
exports.usersList = usersList;
exports.approveUser = approveUser;
exports.rejectUser = rejectUser;
exports.verifyUser = verifyUser;
exports.clientIndex = clientIndex;
exports.adminIndex = adminIndex;
exports.qrCode = qrCode;